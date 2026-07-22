<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'

import type {
  LayerGroup,
  Map as LeafletMap,
  Marker,
  TileLayer,
} from 'leaflet'

import 'leaflet/dist/leaflet.css'

/* -------------------------------------------------------------------------- */
/* Theme                                                                      */
/* -------------------------------------------------------------------------- */

const colorMode = useColorMode()

const themeClass = computed(() => {
  return colorMode.value === 'dark'
    ? 'dark'
    : 'light'
})

/* -------------------------------------------------------------------------- */
/* Dashboard data                                                             */
/* -------------------------------------------------------------------------- */

const summaryCards = [
  {
    title: 'สำรองรวม',
    value: 117,
    unit: 'วัน',
    description: 'ปริมาณรวม 14,442 ล้านลิตร',
    icon: 'i-lucide-gauge',
  },
  {
    title: 'สำรองตามกฎหมาย',
    value: 25,
    unit: 'วัน',
    description: 'ปริมาณรวม 3,354 ล้านลิตร',
    icon: 'i-lucide-shield-check',
  },
  {
    title: 'สำรองเพื่อการค้า',
    value: 31,
    unit: 'วัน',
    description: 'ปริมาณรวม 2,729 ล้านลิตร',
    icon: 'i-lucide-fuel',
  },
  {
    title: 'ระหว่างขนส่ง',
    value: 35,
    unit: 'วัน',
    description: 'ปริมาณรวม 5,120 ล้านลิตร',
    icon: 'i-lucide-ship',
  },
  {
    title: 'ยืนยันจัดหา',
    value: 26,
    unit: 'วัน',
    description: 'ปริมาณรวม 3,239 ล้านลิตร',
    icon: 'i-lucide-clipboard-check',
  },
]

const crudeSummary = [
  {
    title: 'ปริมาณรวมทั้งหมด',
    value: '43.38',
    april: '16.63',
    may: '26.75',
    color: 'success',
  },
  {
    title: 'ตะวันออกกลาง',
    value: '12.00',
    april: '7.50',
    may: '4.50',
    color: 'danger',
  },
  {
    title: 'แหล่งอื่นๆ',
    value: '31.38',
    april: '9.13',
    may: '22.25',
    color: 'info',
  },
]

const sourceBars = [
  { name: 'Other', value: 13.69, group: 'other' },
  { name: 'Libya', value: 2, group: 'other' },
  { name: 'Argentina', value: 2.29, group: 'other' },
  { name: 'Nigeria', value: 2.6, group: 'other' },
  { name: 'Malaysia', value: 2.61, group: 'other' },
  { name: 'Saudi Arabia', value: 4.5, group: 'middle-east' },
  { name: 'UAE', value: 7.5, group: 'middle-east' },
  { name: 'USA', value: 8.19, group: 'other' },
]

const refineryShare = [
  { name: 'IRPC', value: 22, color: 'var(--chart-1)' },
  { name: 'BCP', value: 19, color: 'var(--chart-2)' },
  { name: 'BSRC', value: 18, color: 'var(--chart-3)' },
  { name: 'PTT GC', value: 15, color: 'var(--accent-green)' },
  { name: 'SPRC', value: 15, color: 'var(--chart-4)' },
  { name: 'Thai Oil', value: 11, color: 'var(--chart-5)' },
]

const barMax = Math.max(...sourceBars.map(item => item.value))

function barWidth(value: number) {
  return Math.max((value / barMax) * 100, 8)
}

function formatNumber(value: number) {
  if (Number.isInteger(value))
    return value.toString()

  return value
    .toFixed(2)
    .replace(/0+$/, '')
    .replace(/\.$/, '')
}

const donutGradient = computed(() => {
  let start = 0

  const parts = refineryShare.map((item) => {
    const end = start + item.value
    const section = `${item.color} ${start}% ${end}%`

    start = end
    return section
  })

  return `conic-gradient(${parts.join(', ')})`
})

/* -------------------------------------------------------------------------- */
/* Vessel data                                                                */
/* -------------------------------------------------------------------------- */

interface Vessel {
  uuid: string
  name: string | null
  mmsi: string
  imo: string | null
  eni: string | null
  country_iso: string | null
  type: string | null
  type_specific: string | null
  lat: number | null
  lon: number | null
  speed: number | null
  course: number | null
  heading: number | null
  navigation_status: string | null
  destination: string | null
  last_position_epoch: number | null
  last_position_UTC: string | null
  eta_epoch: number | null
  eta_UTC: string | null
}

interface VesselBulkResponse {
  data: {
    total: number
    vessels: Vessel[]
  }
}

const vessels = ref<Vessel[]>([])
const vesselLoading = ref(false)
const vesselError = ref('')
const lastVesselUpdate = ref<Date | null>(null)

let vesselRequestController: AbortController | null = null
let hasFittedVessels = false

function isValidCoordinate(vessel: Vessel) {
  return (
    typeof vessel.lat === 'number'
    && Number.isFinite(vessel.lat)
    && vessel.lat >= -90
    && vessel.lat <= 90
    && typeof vessel.lon === 'number'
    && Number.isFinite(vessel.lon)
    && vessel.lon >= -180
    && vessel.lon <= 180
  )
}

function formatThaiDateTime(value: Date | string | null) {
  if (!value)
    return '-'

  const date = value instanceof Date
    ? value
    : new Date(value)

  if (Number.isNaN(date.getTime()))
    return '-'

  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'short',
    timeStyle: 'medium',
    hour12: false,
    timeZone: 'Asia/Bangkok',
  }).format(date)
}

const lastVesselUpdateText = computed(() => {
  return formatThaiDateTime(lastVesselUpdate.value)
})

const latestVesselPositionText = computed(() => {
  const latestTimestamp = vessels.value.reduce((latest, vessel) => {
    if (!vessel.last_position_UTC)
      return latest

    const timestamp = new Date(vessel.last_position_UTC).getTime()

    if (Number.isNaN(timestamp))
      return latest

    return Math.max(latest, timestamp)
  }, 0)

  if (!latestTimestamp)
    return '-'

  return formatThaiDateTime(new Date(latestTimestamp))
})

/* -------------------------------------------------------------------------- */
/* Leaflet map                                                                */
/* -------------------------------------------------------------------------- */

const worldMapEl = ref<HTMLDivElement | null>(null)

let leafletApi: typeof import('leaflet') | null = null
let worldMap: LeafletMap | null = null
let lightTileLayer: TileLayer | null = null
let darkTileLayer: TileLayer | null = null
let vesselLayerGroup: LayerGroup | null = null
let resizeObserver: ResizeObserver | null = null
let resizeFrame = 0

const vesselMarkers: Marker[] = []

function createTileLayers(L: typeof import('leaflet')) {
  if (!worldMap)
    return

  const tileOptions = {
    subdomains: 'abcd',
    maxZoom: 20,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    updateWhenIdle: true,
    keepBuffer: 2,
  }

  lightTileLayer = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {
      ...tileOptions,
      opacity: themeClass.value === 'dark' ? 0 : 1,
      zIndex: themeClass.value === 'dark' ? 1 : 2,
    },
  ).addTo(worldMap)

  darkTileLayer = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    {
      ...tileOptions,
      opacity: themeClass.value === 'dark' ? 1 : 0,
      zIndex: themeClass.value === 'dark' ? 2 : 1,
    },
  ).addTo(worldMap)
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#039;',
  }

  return value.replace(/[&<>"']/g, character => entities[character] ?? character)
}

function displayVesselName(vessel: Vessel) {
  return vessel.name?.trim() || `MMSI ${vessel.mmsi}`
}

function displayVesselDirection(vessel: Vessel) {
  const direction = vessel.heading ?? vessel.course ?? 0

  if (!Number.isFinite(direction))
    return 0

  return Math.round(direction) % 360
}

function createVesselIcon(
  L: typeof import('leaflet'),
  vessel: Vessel,
) {
  const direction = displayVesselDirection(vessel)

  return L.divIcon({
    className: 'vessel-div-icon',
    html: `
      <div class="vessel-marker">
        <span
          class="vessel-marker-arrow"
          style="transform: rotate(${direction}deg)"
        >
          ▲
        </span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16],
    tooltipAnchor: [0, -16],
  })
}

function vesselPopupHtml(vessel: Vessel) {
  const speed = typeof vessel.speed === 'number'
    ? `${vessel.speed.toFixed(1)} นอต`
    : '-'

  const course = typeof vessel.course === 'number'
    ? `${Math.round(vessel.course)}°`
    : '-'

  const destination = vessel.destination
    ? escapeHtml(vessel.destination)
    : '-'

  const vesselType = vessel.type_specific || vessel.type || '-'

  return `
    <div class="vessel-popup">
      <strong>${escapeHtml(displayVesselName(vessel))}</strong>

      <dl>
        <div><dt>MMSI</dt><dd>${escapeHtml(vessel.mmsi)}</dd></div>
        <div><dt>IMO</dt><dd>${escapeHtml(vessel.imo || '-')}</dd></div>
        <div><dt>ประเภท</dt><dd>${escapeHtml(vesselType)}</dd></div>
        <div><dt>ความเร็ว</dt><dd>${speed}</dd></div>
        <div><dt>ทิศทาง</dt><dd>${course}</dd></div>
        <div><dt>ปลายทาง</dt><dd>${destination}</dd></div>
        <div><dt>ตำแหน่งล่าสุด</dt><dd>${formatThaiDateTime(vessel.last_position_UTC)}</dd></div>
      </dl>
    </div>
  `
}

function renderVesselMarkers() {
  if (!leafletApi || !worldMap || !vesselLayerGroup)
    return

  vesselLayerGroup.clearLayers()
  vesselMarkers.length = 0

  const L = leafletApi

  vessels.value
    .filter(isValidCoordinate)
    .forEach((vessel) => {
      const marker = L.marker(
        [vessel.lat as number, vessel.lon as number],
        {
          icon: createVesselIcon(L, vessel),
          keyboard: true,
          riseOnHover: true,
          title: displayVesselName(vessel),
        },
      )

      marker
        .bindTooltip(
          escapeHtml(displayVesselName(vessel)),
          {
            direction: 'top',
            opacity: 1,
            className: 'vessel-tooltip',
          },
        )
        .bindPopup(
          vesselPopupHtml(vessel),
          {
            maxWidth: 320,
            className: 'vessel-popup-shell',
          },
        )
        .addTo(vesselLayerGroup as LayerGroup)

      vesselMarkers.push(marker)
    })
}

function fitMapToVessels(force = false) {
  if (!leafletApi || !worldMap || (!force && hasFittedVessels))
    return

  const positions = vessels.value
    .filter(isValidCoordinate)
    .map(vessel => [
      vessel.lat as number,
      vessel.lon as number,
    ] as [number, number])

  if (!positions.length)
    return

  const bounds = leafletApi.latLngBounds(positions)

  if (!bounds.isValid())
    return

  worldMap.fitBounds(bounds, {
    padding: [42, 42],
    maxZoom: 8,
    animate: false,
  })

  hasFittedVessels = true
}

function applyMapTheme() {
  if (!worldMap || !lightTileLayer || !darkTileLayer)
    return

  const isDark = themeClass.value === 'dark'

  lightTileLayer.setOpacity(isDark ? 0 : 1)
  darkTileLayer.setOpacity(isDark ? 1 : 0)
  lightTileLayer.setZIndex(isDark ? 1 : 2)
  darkTileLayer.setZIndex(isDark ? 2 : 1)

  vesselMarkers.forEach((marker) => {
    marker.setZIndexOffset(500)
  })
}

async function fetchVessels() {
  if (vesselLoading.value)
    return

  vesselLoading.value = true
  vesselError.value = ''

  vesselRequestController?.abort()

  const controller = new AbortController()
  vesselRequestController = controller

  try {
    const response = await $fetch<VesselBulkResponse>(
      '/api/directus/vessels',
      { signal: controller.signal },
    )

    const receivedVessels = response?.data?.vessels

    if (!Array.isArray(receivedVessels)) {
      throw new TypeError('รูปแบบข้อมูลเรือจาก API ไม่ถูกต้อง')
    }

    vessels.value = receivedVessels.filter(isValidCoordinate)
    lastVesselUpdate.value = new Date()

    renderVesselMarkers()
    fitMapToVessels()
  }
  catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError')
      return

    vesselError.value = error instanceof Error
      ? error.message
      : 'ไม่สามารถดึงข้อมูลเรือได้'
  }
  finally {
    if (vesselRequestController === controller)
      vesselRequestController = null

    vesselLoading.value = false
  }
}

async function initWorldMap() {
  if (!worldMapEl.value || worldMap)
    return

  const leafletModule = await import('leaflet')
  const L = leafletModule.default ?? leafletModule

  leafletApi = L

  worldMap = L.map(worldMapEl.value, {
    center: [10.5, 100.5],
    zoom: 6,
    minZoom: 3,
    maxZoom: 12,
    zoomControl: true,
    attributionControl: true,
    worldCopyJump: true,
    fadeAnimation: false,
    zoomAnimation: true,
    markerZoomAnimation: true,
    preferCanvas: false,
  })

  createTileLayers(L)

  vesselLayerGroup = L.layerGroup().addTo(worldMap)

  L.control
    .scale({
      metric: true,
      imperial: false,
      position: 'bottomleft',
    })
    .addTo(worldMap)

  applyMapTheme()

  requestAnimationFrame(() => {
    worldMap?.invalidateSize({
      pan: false,
      animate: false,
    })
  })

  resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame)

    resizeFrame = requestAnimationFrame(() => {
      worldMap?.invalidateSize({
        pan: false,
        animate: false,
      })
    })
  })

  resizeObserver.observe(worldMapEl.value)
}

watch(
  themeClass,
  async () => {
    await nextTick()
    applyMapTheme()
  },
  { flush: 'post' },
)

onMounted(async () => {
  await nextTick()
  await initWorldMap()
  await fetchVessels()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(resizeFrame)

  vesselRequestController?.abort()
  vesselRequestController = null

  resizeObserver?.disconnect()
  resizeObserver = null

  vesselLayerGroup?.clearLayers()
  vesselLayerGroup = null

  worldMap?.remove()
  worldMap = null

  lightTileLayer = null
  darkTileLayer = null
  leafletApi = null

  vesselMarkers.length = 0
})
</script>

<template>
  <div
    class="reserve-dashboard"
    :class="themeClass"
  >
    <header class="page-header">
      <div class="page-heading">
        <!-- <div class="page-title-icon">
          <Icon name="i-lucide-landmark" size="22" />
        </div> -->

        <div class="min-w-0">
          <h1 class="page-title">
            ปริมาณน้ำมันสำรองภายในประเทศ
          </h1>
        </div>
      </div>

      <div class="page-actions">
        <BaseDateRangePicker />
      </div>
    </header>

    <!-- KPI -->
    <section class="summary-grid">
      <article
        v-for="card in summaryCards"
        :key="card.title"
        class="summary-card"
      >
        <div class="summary-card-content">
          <h2 class="summary-title">
            {{ card.title }}
          </h2>

          <div class="summary-value-row">
            <strong>{{ card.value }}</strong>
            <span>{{ card.unit }}</span>
          </div>

          <p class="summary-description">
            {{ card.description }}
          </p>
        </div>

        <div class="summary-icon">
          <Icon
            :name="card.icon"
            size="27"
          />
        </div>
      </article>
    </section>

    <main class="content-grid">
      <section class="panel map-section">
        <div class="panel-title-row">
          <div class="heading-group">
            <!-- <div class="panel-icon">
              <Icon name="i-lucide-ship" size="18" />
            </div> -->

            <div>
              <h3>ตำแหน่งปัจจุบันของเรือขนส่งน้ำมัน</h3>
              <p class="panel-subtitle">
                ตำแหน่งล่าสุด:
              {{ latestVesselPositionText }}
              · อัปเดตเมื่อ:
              {{ lastVesselUpdateText }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="refresh-vessel-button"
            :disabled="vesselLoading"
            @click="fetchVessels"
          >
            {{ vesselLoading ? 'กำลังอัปเดต...' : 'รีเฟรชข้อมูล' }}
          </button>

        </div>

        <div class="map-frame">
          <div
            ref="worldMapEl"
            class="world-map"
            role="img"
            aria-label="แผนที่ตำแหน่งเรือขนส่งน้ำมันล่าสุด"
          />

          <div
            v-if="vesselLoading && !vessels.length"
            class="map-loading-overlay"
          >
            กำลังโหลดตำแหน่งเรือ...
          </div>
        </div>
      </section>

      <aside class="right-column">
        <div class="right-panel-grid">
          <section class="panel source-section">
            <div class="panel-title-row source-title-row">
              <div class="heading-group">
                <div>
                  <h3>ปริมาณน้ำมันดิบที่นำเข้า</h3>
                  <p class="panel-subtitle">
                    แยกตามแหล่งต้นทาง
                  </p>
                </div>
              </div>

              <span class="unit-badge">ล้านบาร์เรล</span>
            </div>

            <div class="source-list">
              <article
                v-for="item in sourceBars"
                :key="item.name"
                class="source-item"
                :class="item.group"
              >
                <div class="source-label">
                  <span>{{ item.name }}</span>
                  <strong>{{ formatNumber(item.value) }}</strong>
                </div>

                <div class="progress-track">
                  <div
                    class="progress-fill"
                    :class="item.group"
                    :style="{ width: `${barWidth(item.value)}%` }"
                  />
                </div>
              </article>
            </div>

            <div class="source-legend">
              <span>
                <i class="legend-dot other-dot" />
                แหล่งอื่นๆ
              </span>

              <span>
                <i class="legend-dot middle-east-dot" />
                แหล่งตะวันออกกลาง
              </span>
            </div>
          </section>

          <div class="right-stack">
            <section
              class="panel import-summary-panel"
              aria-label="สรุปปริมาณน้ำมันดิบที่คาดว่าจะนำเข้า"
            >
              <div class="panel-title-row import-summary-title-row">
                <div class="heading-group">
                  <div>
                    <h3>ปริมาณน้ำมันดิบที่คาดว่าจะนำเข้า</h3>
                  </div>
                </div>

                <span class="unit-badge">ล้านบาร์เรล</span>
              </div>

              <div class="import-total">
                <div class="import-total-main">
                  <span>ปริมาณรวมทั้งหมด</span>

                  <div class="import-total-number">
                    <strong>{{ crudeSummary[0].value }}</strong>
                    <!-- <small>ล้านบาร์เรล</small> -->
                  </div>
                </div>

              </div>

              <div class="import-source-breakdown">
                <article
                  v-for="item in crudeSummary.slice(1)"
                  :key="item.title"
                  class="import-source-card"
                >
                  <div class="import-source-heading">
                    <span>{{ item.title }}</span>
                    <strong :class="item.color">
                      {{ item.value }}
                    </strong>
                  </div>

                  <!-- <div class="import-source-periods">
                    <span>
                      เม.ย.
                      <b :class="item.color">{{ item.april }}</b>
                    </span>

                    <span>
                      พ.ค.
                      <b :class="item.color">{{ item.may }}</b>
                    </span>
                  </div> -->
                </article>
              </div>
            </section>

            <section class="panel refinery-section">
              <div class="panel-title-row refinery-title-row">
                <div class="heading-group">
                  <!-- <div class="panel-icon">
                    <Icon name="i-lucide-chart-pie" size="18" />
                  </div> -->

                  <div>
                    <h3>สัดส่วนการจัดหาน้ำมันดิบ</h3>
                    <p class="panel-subtitle">
                      แยกตามรายโรงกลั่น
                    </p>
                  </div>

                  
                </div>

                <span class="unit-badge">ร้อยละ</span>
              </div>

              <div class="donut-wrap">
                <div
                  class="donut"
                  :style="{ background: donutGradient }"
                >
                  <div class="donut-hole">
                    <span>By Refinery</span>
                    <span>Capacity</span>
                  </div>
                </div>
              </div>

              <div class="donut-legend">
                <div
                  v-for="item in refineryShare"
                  :key="item.name"
                  class="donut-legend-row"
                >
                  <i :style="{ backgroundColor: item.color }" />
                  <span>{{ item.name }}</span>
                  <strong>{{ item.value }}%</strong>
                </div>
              </div>
            </section>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.reserve-dashboard {
  --page-bg: var(--background);
  --panel-bg: var(--card);
  --panel-bg-deep: var(--muted);
  --card-bg: var(--card);
  --card-border: var(--border);
  --text-main: var(--foreground);
  --text-muted: var(--muted-foreground);
  --title: var(--foreground);
  --primary-color: var(--primary);
  --track: var(--muted);

  /* สีของแหล่งนำเข้า ปรับตาม Shadcn theme */
  --source-other-color: color-mix(
    in oklab,
    var(--primary) 88%,
    var(--chart-1, #06b6d4)
  );
  --source-middle-east-color: color-mix(
    in oklab,
    var(--primary) 32%,
    var(--chart-4, #f59e0b)
  );

  --accent-green: color-mix(in oklab, var(--primary) 68%, var(--chart-3, #84cc16));
  --success-color: var(--primary);
  --danger-color: var(--accent-green);
  --warning-color: color-mix(in oklab, var(--primary) 78%, var(--chart-2, #22c55e));
  --info-color: color-mix(in oklab, var(--primary) 82%, var(--chart-1, #14b8a6));
  --neutral-color: color-mix(in oklab, var(--primary) 62%, var(--muted-foreground));

  width: 100%;
  min-width: 0;
  min-height: 100%;
  padding: 0 0 1.5rem;
  overflow-x: hidden;
  color: var(--text-main);
  background: var(--page-bg);
  font-family: "Sarabun", "Noto Sans Thai", Tahoma, Arial, sans-serif;
}

.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.page-heading,
.heading-group {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  gap: 0.8rem;
}

.page-heading {
  flex: 1 1 420px;
}

.page-title-icon,
.panel-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid color-mix(in oklab, var(--primary) 28%, var(--border));
  color: var(--primary);
  background: color-mix(in oklab, var(--primary) 10%, var(--card));
  box-shadow: inset 0 1px 0 color-mix(in oklab, white 20%, transparent);
}

.page-title-icon {
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 0.9rem;
}

.page-title {
  margin: 0;
  color: var(--foreground);
  font-size: clamp(1.25rem, 2vw, 1.65rem);
  font-weight: 750;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.page-description,
.panel-subtitle {
  margin: 0.25rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.78rem;
  line-height: 1.5;
}

.page-actions {
  display: flex;
  flex: 0 1 auto;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.6rem;
}

.data-status {
  display: inline-flex;
  min-height: 2.25rem;
  align-items: center;
  gap: 0.45rem;
  padding: 0 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.7rem;
  color: var(--muted-foreground);
  background: var(--card);
  font-size: 0.72rem;
  font-weight: 650;
  white-space: nowrap;
}

.data-status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--primary);
  box-shadow: 0 0 0 0.22rem color-mix(in oklab, var(--primary) 14%, transparent);
}

/* KPI */
.summary-grid {
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.75rem;
}

.summary-card {
  position: relative;
  display: flex;
  align-items: stretch;
  min-width: 0;
  min-height: 116px;
  padding: 1rem 4.8rem 0.9rem 1rem;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 1rem;
  color: var(--foreground);
  background: var(--card);
  box-shadow:
    0 1px 2px color-mix(in oklab, var(--foreground) 6%, transparent),
    0 3px 8px color-mix(in oklab, var(--foreground) 5%, transparent);
  text-align: left;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in oklab, var(--primary) 30%, var(--border));
  box-shadow:
    0 2px 4px color-mix(in oklab, var(--foreground) 7%, transparent),
    0 8px 18px color-mix(in oklab, var(--foreground) 8%, transparent);
}

.summary-card-content {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}

.summary-title {
  margin: 0;
  overflow: hidden;
  color: var(--muted-foreground);
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-value-row {
  display: flex;
  align-items: baseline;
  min-width: 0;
  gap: 0.5rem;
  margin-top: 0.35rem;
  font-variant-numeric: tabular-nums;
}

.summary-value-row strong {
  color: var(--foreground);
  font-size: clamp(1.65rem, 2vw, 2rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.035em;
}

.summary-value-row span {
  color: var(--muted-foreground);
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
}

.summary-description {
  margin: auto 0 0;
  overflow: hidden;
  color: var(--muted-foreground);
  font-size: 0.67rem;
  font-weight: 500;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border: 0;
  border-radius: 1rem;
  color: var(--primary);
  background: color-mix(in oklab, var(--primary) 11%, var(--card));
  box-shadow: none;
}

/* Content */
.content-grid {
  display: grid;
  min-width: 0;
  margin-top: 1rem;

  /* ใช้ฐาน 5 คอลัมน์เดียวกับ KPI ด้านบน */
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: stretch;
  gap: 0.75rem;
}

.map-section {
  grid-column: span 3;
}

.right-column {
  grid-column: span 2;
  min-width: 0;
}

.right-panel-grid {
  display: grid;
  min-width: 0;
  height: auto;
  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr);
  align-items: stretch;
  gap: 0.75rem;
}

.right-stack {
  display: grid;
  min-width: 0;
  grid-column: 1;
  grid-row: 1;
  grid-template-rows: auto auto;
  align-content: start;
  align-self: stretch;
  height: auto;
  gap: 0.75rem;
}

.source-section {
  grid-column: 2;
  grid-row: 1;
  align-self: stretch;
  height: 100%;
}

.panel {
  min-width: 0;
  min-height: 0;
  padding: 1rem;
  border: 1px solid var(--card-border);
  border-radius: 1rem;
  color: var(--text-main);
  background: var(--panel-bg);
  box-shadow: 0 1px 2px color-mix(in oklab, var(--foreground) 5%, transparent);
}

.map-section,
.source-section,
.refinery-section {
  display: flex;
  flex-direction: column;
}

.map-section {
  height: 100%;
}

.refinery-section {
  align-self: start;
  height: auto;
}

.panel-title-row {
  display: flex;
  min-height: 0;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.65rem;
  margin-bottom: 0.85rem;
}

.panel-title-row .heading-group {
  flex: 1 1 260px;
}

.panel-title-row h3 {
  margin: 0;
  color: var(--title);
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.35;
}

.panel-subtitle {
  font-size: 0.7rem;
}

.unit-badge {
  display: inline-flex;
  min-height: 1.75rem;
  align-items: center;
  padding: 0 0.55rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--muted-foreground);
  background: var(--muted);
  font-size: 0.65rem;
  font-weight: 650;
}

/* Import summary */
.import-summary-panel {
  display: flex;
  flex-direction: column;
}

.import-summary-title-row {
  flex-wrap: nowrap;
  align-items: flex-start;
  margin-bottom: 0.7rem;
}

.import-summary-title-row .heading-group {
  flex: 1 1 auto;
  min-width: 0;
}

.import-summary-title-row .unit-badge {
  flex: 0 0 auto;
  margin-left: auto;
}

.source-title-row,
.refinery-title-row {
  flex-wrap: nowrap;
  align-items: flex-start;
}

.source-title-row .heading-group,
.refinery-title-row .heading-group {
  flex: 1 1 auto;
  min-width: 0;
}

.source-title-row .unit-badge,
.refinery-title-row .unit-badge {
  flex: 0 0 auto;
  margin-left: auto;
}

.import-total {
  padding: 0.85rem;
  border: 1px solid color-mix(in oklab, var(--primary) 24%, var(--border));
  border-radius: 0.85rem;
  background: color-mix(in oklab, var(--primary) 7%, var(--card));
}

.import-total-main {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.import-total-main > span {
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 650;
  line-height: 1.4;
}

.import-total-number {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-end;
}

.import-total-number strong {
  color: var(--primary-color);
  font-size: clamp(1.7rem, 2.2vw, 2.15rem);
  font-weight: 820;
  line-height: 1;
  letter-spacing: -0.045em;
  font-variant-numeric: tabular-nums;
}

.import-total-number small {
  margin-top: 0.25rem;
  color: var(--text-muted);
  font-size: 0.58rem;
  font-weight: 600;
}

.import-total-periods,
.import-source-periods {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem;
}

.import-total-periods {
  margin-top: 0.75rem;
}

.import-total-periods span,
.import-source-periods span {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  padding: 0.34rem 0.45rem;
  border-radius: 0.5rem;
  color: var(--text-muted);
  background: var(--muted);
  font-size: 0.62rem;
  font-weight: 600;
  white-space: nowrap;
}

.import-total-periods b,
.import-source-periods b {
  color: var(--text-main);
  font-size: 0.69rem;
  font-weight: 760;
  font-variant-numeric: tabular-nums;
}

.import-source-breakdown {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
  margin-top: 0.55rem;
}

.import-source-card {
  min-width: 0;
  padding: 0.7rem;
  border: 1px solid var(--card-border);
  border-radius: 0.75rem;
  background: color-mix(in oklab, var(--muted) 54%, var(--card));
}

.import-source-heading {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.import-source-heading span {
  min-width: 0;
  color: var(--text-main);
  font-size: 0.66rem;
  font-weight: 650;
  line-height: 1.35;
}

.import-source-heading strong {
  flex: 0 0 auto;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.import-source-periods {
  gap: 0.3rem;
  margin-top: 0.55rem;
}

.import-source-periods span {
  padding: 0.27rem 0.32rem;
  font-size: 0.56rem;
}

.import-source-periods b {
  font-size: 0.61rem;
}

.success { color: var(--success-color); }
.danger { color: var(--danger-color); }
.warning { color: var(--warning-color); }
.info { color: var(--info-color); }
.neutral { color: var(--neutral-color); }

/* Map */
.map-frame {
  position: relative;
  z-index: 0;
  flex: 1 1 auto;
  width: 100%;
  min-height: clamp(440px, 30vw, 500px);
  overflow: hidden;
  border: 1px solid var(--card-border);
  border-radius: 0.85rem;
  background: var(--panel-bg-deep);
  isolation: isolate;
  contain: paint;
}

.world-map {
  position: relative;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--panel-bg-deep);
}

:deep(.world-map.leaflet-container) {
  position: relative;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: var(--text-main);
  background: var(--panel-bg-deep);
  font-family: inherit;
  isolation: isolate;
}

:deep(.world-map .leaflet-map-pane) { z-index: 0; }
:deep(.world-map .leaflet-tile-pane) { z-index: 200; }
:deep(.world-map .leaflet-overlay-pane) { z-index: 400; }
:deep(.world-map .leaflet-marker-pane) { z-index: 600; }
:deep(.world-map .leaflet-tooltip-pane) { z-index: 650; }
:deep(.world-map .leaflet-control-container),
:deep(.world-map .leaflet-top),
:deep(.world-map .leaflet-bottom) { z-index: 800; }

:deep(.world-map .leaflet-tile) {
  backface-visibility: hidden;
}

:deep(.world-map .leaflet-control-zoom) {
  overflow: hidden;
  border: 1px solid var(--card-border);
  border-radius: 7px;
  box-shadow: 0 2px 8px color-mix(in oklab, var(--foreground) 15%, transparent);
}

:deep(.world-map .leaflet-control-zoom a) {
  width: 33px;
  height: 32px;
  border-color: var(--card-border);
  color: var(--text-main);
  background: var(--panel-bg);
  font-size: 22px;
  line-height: 31px;
}

:deep(.world-map .leaflet-control-zoom a:hover) {
  color: var(--primary-color);
  background: var(--accent);
}

:deep(.world-map .leaflet-control-attribution) {
  padding: 2px 5px;
  color: var(--text-muted);
  background: color-mix(in oklab, var(--panel-bg) 90%, transparent);
  font-size: 10px;
}

:deep(.world-map .leaflet-control-attribution a) {
  color: var(--primary-color);
}

:deep(.world-map .leaflet-control-scale-line) {
  border-color: var(--text-main);
  color: var(--text-main);
  background: color-mix(in oklab, var(--panel-bg) 82%, transparent);
  font-size: 10px;
  font-weight: 700;
}

:deep(.world-map .leaflet-popup-content-wrapper),
:deep(.world-map .leaflet-popup-tip) {
  color: var(--text-main);
  background: var(--panel-bg);
}

:deep(.world-map .leaflet-popup-content-wrapper) {
  border: 1px solid var(--card-border);
  border-radius: 8px;
  box-shadow: 0 10px 26px color-mix(in oklab, var(--foreground) 22%, transparent);
}

:deep(.world-map .leaflet-popup-content) {
  margin: 12px 14px;
}

:deep(.world-map .vessel-div-icon) {
  border: 0;
  background: transparent;
}

:deep(.world-map .vessel-marker) {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 2px solid color-mix(in oklab, var(--primary-color) 75%, white);
  border-radius: 999px;
  background: color-mix(in oklab, var(--primary-color) 88%, black);
  box-shadow:
    0 0 0 4px color-mix(in oklab, var(--primary-color) 24%, transparent),
    0 4px 10px color-mix(in oklab, var(--foreground) 25%, transparent);
}

:deep(.world-map .vessel-marker-arrow) {
  display: block;
  color: white;
  font-size: 18px;
  line-height: 1;
  transform-origin: center;
}

:deep(.world-map .vessel-tooltip) {
  padding: 4px 8px;
  border: 1px solid var(--card-border);
  border-radius: 5px;
  color: var(--text-main);
  background: var(--panel-bg);
  box-shadow: 0 2px 7px color-mix(in oklab, var(--foreground) 20%, transparent);
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

:deep(.world-map .vessel-tooltip::before) {
  border-top-color: var(--panel-bg);
}

:deep(.world-map .vessel-popup) {
  min-width: 230px;
  font-family: inherit;
}

:deep(.world-map .vessel-popup > strong) {
  display: block;
  margin-bottom: 9px;
  color: var(--primary-color);
  font-size: 15px;
}

:deep(.world-map .vessel-popup dl) {
  display: grid;
  gap: 5px;
  margin: 0;
}

:deep(.world-map .vessel-popup dl > div) {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 8px;
}

:deep(.world-map .vessel-popup dt) {
  color: var(--text-muted);
  font-weight: 600;
}

:deep(.world-map .vessel-popup dd) {
  min-width: 0;
  margin: 0;
  color: var(--text-main);
  font-weight: 600;
  overflow-wrap: anywhere;
}

.map-loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 700;
  display: grid;
  place-items: center;
  color: var(--text-main);
  background: color-mix(in oklab, var(--panel-bg) 78%, transparent);
  font-size: 14px;
  font-weight: 700;
  backdrop-filter: blur(2px);
}

.vessel-map-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 39px;
  margin-top: 8px;
}

.vessel-status-info {
  display: flex;
  flex: 1 1 240px;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  min-width: 0;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.5;
}

.vessel-count {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--text-main);
  font-weight: 700;
  white-space: nowrap;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--success-color);
  box-shadow: 0 0 0 4px color-mix(in oklab, var(--success-color) 18%, transparent);
}

.status-dot.loading {
  animation: vessel-pulse 1s ease-in-out infinite;
}

.vessel-error {
  color: var(--destructive);
  font-weight: 700;
}

.refresh-vessel-button {
  flex: 0 0 auto;
  min-height: 2.25rem;
  padding: 5px 12px;
  border: 1px solid color-mix(in oklab, var(--primary-color) 55%, var(--card-border));
  border-radius: 0.65rem;
  color: var(--primary-color);
  background: color-mix(in oklab, var(--primary-color) 9%, var(--panel-bg));
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    color 160ms ease,
    background-color 160ms ease,
    border-color 160ms ease,
    opacity 160ms ease;
}

.refresh-vessel-button:hover:not(:disabled) {
  color: var(--primary-foreground);
  background: var(--primary-color);
}

.refresh-vessel-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@keyframes vessel-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.45;
    transform: scale(0.82);
  }
}

/* Source bars */
.source-list {
  flex: 1;
  margin-top: 0.25rem;
}

.source-item {
  margin-bottom: 0.75rem;
}

.source-item.middle-east .progress-track {
  background: color-mix(
    in oklab,
    var(--source-middle-east-color) 12%,
    var(--track)
  );
}

.source-label {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
  color: var(--text-main);
  font-size: 0.78rem;
  font-weight: 600;
}

.progress-track {
  width: 100%;
  height: 0.65rem;
  overflow: hidden;
  border-radius: 999px;
  background: var(--track);
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  transition: width 200ms ease, background-color 200ms ease;
}

.progress-fill.other {
  background: var(--source-other-color);
}

.progress-fill.middle-east {
  background: var(--source-middle-east-color);
}

.source-item.other .source-label strong {
  color: var(--source-other-color);
}

.source-item.middle-east .source-label strong {
  color: var(--source-middle-east-color);
}

.source-legend {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
  margin-top: auto;
  padding: 0.75rem 0 0;
  border-top: 1px solid var(--border);
  color: var(--text-main);
  font-size: 0.7rem;
}

.source-legend span {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.legend-dot {
  display: block;
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
}

.other-dot {
  background: var(--source-other-color);
}

.middle-east-dot {
  background: var(--source-middle-east-color);
}

/* Donut */
.donut-wrap {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  padding: 0.5rem 0;
}

.donut {
  position: relative;
  width: min(230px, 72vw);
  max-width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  transition: background 200ms ease;
}

.donut-hole {
  position: absolute;
  inset: 23%;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 0.15rem;
  border-radius: 50%;
  color: var(--text-main);
  background: var(--panel-bg);
  font-size: 0.82rem;
  font-weight: 650;
}

.donut-legend {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem 0.8rem;
  margin-top: 0.5rem;
}

.donut-legend-row {
  display: grid;
  grid-template-columns: 0.7rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.45rem;
  color: var(--text-main);
  font-size: 0.72rem;
}

.donut-legend-row i {
  display: block;
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
}

/* Responsive */
@media (max-width: 1399px) {
  .summary-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .content-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .map-section,
  .right-column {
    grid-column: auto;
  }

  .map-frame {
    min-height: 480px;
  }
}

@media (max-width: 899px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .right-panel-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .right-stack,
  .source-section {
    grid-column: auto;
    grid-row: auto;
    height: auto;
  }

  .right-stack {
    order: 1;
    align-self: start;
  }

  .source-section {
    order: 2;
    align-self: start;
  }

  .map-frame {
    min-height: 400px;
  }
}

@media (max-width: 767px) {
  .import-source-breakdown {
    grid-template-columns: minmax(0, 1fr);
  }

  .map-frame {
    min-height: 340px;
  }
}

@media (max-width: 639px) {
  .reserve-dashboard {
    padding-bottom: 1rem;
  }

  .page-header,
  .page-actions {
    display: grid;
    width: 100%;
  }

  .page-actions {
    grid-template-columns: minmax(0, 1fr);
    justify-content: stretch;
  }

  .data-status {
    justify-content: center;
  }

  .page-actions :deep(button),
  .page-actions :deep([role='button']) {
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .summary-card {
    min-height: 110px;
    padding: 0.9rem 4.5rem 0.85rem 0.9rem;
  }

  .summary-icon {
    top: 0.9rem;
    right: 0.9rem;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.85rem;
  }

  .summary-value-row strong {
    font-size: 1.8rem;
  }

  .panel {
    padding: 0.8rem;
    border-radius: 0.85rem;
  }

  .panel-title-row {
    display: grid;
  }

  .source-title-row,
  .refinery-title-row {
    display: flex;
  }

  .unit-badge {
    width: fit-content;
  }

  .import-total-main {
    align-items: center;
  }

  .import-total-number strong {
    font-size: 1.8rem;
  }

  .map-frame {
    min-height: 300px;
  }

  .vessel-map-status {
    display: grid;
    align-items: flex-start;
  }

  .refresh-vessel-button {
    width: 100%;
  }

  .source-legend,
  .donut-legend {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
