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
    days: 117,
    volume: 'ปริมาณรวม 14,442 ล้านลิตร',
    color: 'success',
  },
  {
    title: 'สำรองตามกฎหมาย',
    days: 25,
    volume: '3,354 ล้านลิตร',
    color: 'danger',
  },
  {
    title: 'สำรองเพื่อการค้า',
    days: 31,
    volume: '2,729 ล้านลิตร',
    color: 'warning',
  },
  {
    title: 'ระหว่างขนส่ง',
    days: 35,
    volume: '5,120 ล้านลิตร',
    color: 'neutral',
  },
  {
    title: 'ยืนยันจัดหา',
    days: 26,
    volume: '3,239 ล้านลิตร',
    color: 'warning',
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
    title: 'แหล่งตะวันออกกลาง',
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
  {
    name: 'Other',
    value: 13.69,
    group: 'other',
  },
  {
    name: 'Libya',
    value: 2,
    group: 'other',
  },
  {
    name: 'Argentina',
    value: 2.29,
    group: 'other',
  },
  {
    name: 'Nigeria',
    value: 2.6,
    group: 'other',
  },
  {
    name: 'Malaysia',
    value: 2.61,
    group: 'other',
  },
  {
    name: 'Saudi Arabia',
    value: 4.5,
    group: 'middle-east',
  },
  {
    name: 'UAE',
    value: 7.5,
    group: 'middle-east',
  },
  {
    name: 'USA',
    value: 8.19,
    group: 'other',
  },
]

const refineryShare = [
  {
    name: 'IRPC',
    value: 22,
    color: 'var(--chart-1)',
  },
  {
    name: 'BCP',
    value: 19,
    color: 'var(--chart-2)',
  },
  {
    name: 'BSRC',
    value: 18,
    color: 'var(--chart-3)',
  },
  {
    name: 'PTT GC',
    value: 15,
    color: 'var(--accent-green)',
  },
  {
    name: 'SPRC',
    value: 15,
    color: 'var(--chart-4)',
  },
  {
    name: 'Thai Oil',
    value: 11,
    color: 'var(--chart-5)',
  },
]

const barMax = Math.max(
  ...sourceBars.map(item => item.value),
)

function barWidth(value: number) {
  return Math.max(
    (value / barMax) * 100,
    8,
  )
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
  const latestTimestamp = vessels.value.reduce(
    (latest, vessel) => {
      if (!vessel.last_position_UTC)
        return latest

      const timestamp = new Date(
        vessel.last_position_UTC,
      ).getTime()

      if (Number.isNaN(timestamp))
        return latest

      return Math.max(latest, timestamp)
    },
    0,
  )

  if (!latestTimestamp)
    return '-'

  return formatThaiDateTime(
    new Date(latestTimestamp),
  )
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

function createTileLayers(
  L: typeof import('leaflet'),
) {
  if (!worldMap)
    return

  const tileOptions = {
    subdomains: 'abcd',
    maxZoom: 20,
    attribution:
      '&copy; OpenStreetMap contributors &copy; CARTO',
    updateWhenIdle: true,
    keepBuffer: 2,
  }

  lightTileLayer = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {
      ...tileOptions,
      opacity: themeClass.value === 'dark'
        ? 0
        : 1,
      zIndex: themeClass.value === 'dark'
        ? 1
        : 2,
    },
  ).addTo(worldMap)

  darkTileLayer = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    {
      ...tileOptions,
      opacity: themeClass.value === 'dark'
        ? 1
        : 0,
      zIndex: themeClass.value === 'dark'
        ? 2
        : 1,
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

  return value.replace(
    /[&<>"']/g,
    character => entities[character] ?? character,
  )
}

function displayVesselName(vessel: Vessel) {
  return vessel.name?.trim()
    || `MMSI ${vessel.mmsi}`
}

function displayVesselDirection(vessel: Vessel) {
  const direction = vessel.heading
    ?? vessel.course
    ?? 0

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

  const vesselType = vessel.type_specific
    || vessel.type
    || '-'

  return `
    <div class="vessel-popup">
      <strong>${escapeHtml(displayVesselName(vessel))}</strong>

      <dl>
        <div>
          <dt>MMSI</dt>
          <dd>${escapeHtml(vessel.mmsi)}</dd>
        </div>

        <div>
          <dt>IMO</dt>
          <dd>${escapeHtml(vessel.imo || '-')}</dd>
        </div>

        <div>
          <dt>ประเภท</dt>
          <dd>${escapeHtml(vesselType)}</dd>
        </div>

        <div>
          <dt>ความเร็ว</dt>
          <dd>${speed}</dd>
        </div>

        <div>
          <dt>ทิศทาง</dt>
          <dd>${course}</dd>
        </div>

        <div>
          <dt>ปลายทาง</dt>
          <dd>${destination}</dd>
        </div>

        <div>
          <dt>ตำแหน่งล่าสุด</dt>
          <dd>${formatThaiDateTime(vessel.last_position_UTC)}</dd>
        </div>
      </dl>
    </div>
  `
}

function renderVesselMarkers() {
  if (
    !leafletApi
    || !worldMap
    || !vesselLayerGroup
  ) {
    return
  }

  vesselLayerGroup.clearLayers()
  vesselMarkers.length = 0

  const L = leafletApi

  vessels.value
    .filter(isValidCoordinate)
    .forEach((vessel) => {
      const marker = L.marker(
        [vessel.lat as number, vessel.lon as number],
        {
          icon: createVesselIcon(
            L,
            vessel,
          ),
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
  if (
    !leafletApi
    || !worldMap
    || (!force && hasFittedVessels)
  ) {
    return
  }

  const positions = vessels.value
    .filter(isValidCoordinate)
    .map(vessel => [
      vessel.lat as number,
      vessel.lon as number,
    ] as [number, number])

  if (!positions.length)
    return

  const bounds = leafletApi.latLngBounds(
    positions,
  )

  if (!bounds.isValid())
    return

  worldMap.fitBounds(
    bounds,
    {
      padding: [42, 42],
      maxZoom: 8,
      animate: false,
    },
  )

  hasFittedVessels = true
}

function applyMapTheme() {
  if (
    !worldMap
    || !lightTileLayer
    || !darkTileLayer
  ) {
    return
  }

  const isDark = themeClass.value === 'dark'

  lightTileLayer.setOpacity(
    isDark ? 0 : 1,
  )

  darkTileLayer.setOpacity(
    isDark ? 1 : 0,
  )

  lightTileLayer.setZIndex(
    isDark ? 1 : 2,
  )

  darkTileLayer.setZIndex(
    isDark ? 2 : 1,
  )

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
      {
        signal: controller.signal,
      },
    )

    const receivedVessels
      = response?.data?.vessels

    if (!Array.isArray(receivedVessels)) {
      throw new TypeError(
        'รูปแบบข้อมูลเรือจาก API ไม่ถูกต้อง',
      )
    }

    vessels.value = receivedVessels
      .filter(isValidCoordinate)

    lastVesselUpdate.value = new Date()

    renderVesselMarkers()
    fitMapToVessels()
  }
  catch (error) {
    if (
      error instanceof DOMException
      && error.name === 'AbortError'
    ) {
      return
    }

    vesselError.value
      = error instanceof Error
        ? error.message
        : 'ไม่สามารถดึงข้อมูลเรือได้'
  }
  finally {
    if (
      vesselRequestController === controller
    ) {
      vesselRequestController = null
    }

    vesselLoading.value = false
  }
}

async function initWorldMap() {
  if (
    !worldMapEl.value
    || worldMap
  ) {
    return
  }

  const leafletModule = await import('leaflet')
  const L = leafletModule.default ?? leafletModule

  leafletApi = L

  worldMap = L.map(
    worldMapEl.value,
    {
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
    },
  )

  createTileLayers(L)

  vesselLayerGroup = L.layerGroup()
    .addTo(worldMap)

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
  {
    flush: 'post',
  },
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
    <!-- Page header -->
    <div class="page-header">
      <h2 class="text-2xl font-bold tracking-tight">
        ปริมาณน้ำมันสำรองภายในประเทศ
      </h2>

      <div class="flex items-center space-x-2">
        <BaseDateRangePicker />
      </div>
    </div>

    <!-- KPI -->
    <section class="summary-grid">
      <article
        v-for="card in summaryCards"
        :key="card.title"
        class="summary-card"
      >
        <div class="summary-title">
          {{ card.title }}
        </div>

        <div
          class="summary-value"
          :class="card.color"
        >
          {{ card.days }}

          <span>วัน</span>
        </div>

        <div class="summary-sub">
          {{ card.volume }}
        </div>
      </article>
    </section>

    <!-- Main heading -->
    <section class="section-header">
      <div class="heading-group">
        <div class="title-marker" />

        <h2>
          สถานการณ์การบริหารอุปทาน โรงกลั่นน้ำมัน
        </h2>
      </div>

      <div class="date-pill">
        21 เม.ย. 69
      </div>
    </section>

    <!-- Content -->
    <main class="content-grid">
      <!-- Map panel -->
      <section class="panel map-section">
        <div class="panel-title-row">
          <div class="heading-group">
            <div class="title-marker" />

            <h3>
              ปริมาณน้ำมันดิบที่นำเข้าทางเรือที่คาดว่าจะเข้าไทย
            </h3>
          </div>

          <span>หน่วย/ล้านบาร์เรล</span>
        </div>

        <div class="import-cards">
          <article
            v-for="item in crudeSummary"
            :key="item.title"
            class="import-card"
          >
            <div>
              {{ item.title }}
            </div>

            <strong :class="item.color">
              {{ item.value }}
            </strong>

            <p>
              เมษายน :

              <b :class="item.color">
                {{ item.april }}
              </b>
            </p>

            <p>
              พฤษภาคม :

              <b :class="item.color">
                {{ item.may }}
              </b>
            </p>
          </article>
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

        <div class="vessel-map-status">
          <div class="vessel-status-info">
            <span class="vessel-count">
              <i
                class="status-dot"
                :class="{ loading: vesselLoading }"
              />

              <!-- พบเรือ {{ vessels.length }} ลำ -->
            </span>

            <span
              v-if="vesselError"
              class="vessel-error"
            >
              {{ vesselError }}
            </span>

            <span v-else>
              ตำแหน่งล่าสุด:
              {{ latestVesselPositionText }}
              · อัปเดตเมื่อ:
              {{ lastVesselUpdateText }}
            </span>
          </div>

          <button
            type="button"
            class="refresh-vessel-button"
            :disabled="vesselLoading"
            @click="fetchVessels"
          >
            {{
              vesselLoading
                ? 'กำลังอัปเดต...'
                : 'รีเฟรชข้อมูล'
            }}
          </button>
        </div>
      </section>

      <!-- Source panel -->
      <section class="panel source-section">
        <div class="panel-title-row">
          <div class="heading-group">
            <div class="title-marker" />

            <h3>
              ปริมาณน้ำมันดิบที่นำเข้า
            </h3>
          </div>

          <span>หน่วย/ล้านบาร์เรล</span>
        </div>

        <div class="source-list">
          <article
            v-for="item in sourceBars"
            :key="item.name"
            class="source-item"
          >
            <div class="source-label">
              {{ item.name }} :
              {{ formatNumber(item.value) }}
            </div>

            <div class="progress-track">
              <div
                class="progress-fill"
                :class="item.group"
                :style="{
                  width: `${barWidth(item.value)}%`,
                }"
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

      <!-- Refinery panel -->
      <section class="panel refinery-section">
        <div class="panel-title-row">
          <div class="heading-group">
            <div class="title-marker" />

            <h3>
              สัดส่วนการจัดหาน้ำมันดิบแยกตามรายโรงกลั่น
            </h3>
          </div>
        </div>

        <div class="donut-wrap">
          <div
            class="donut"
            :style="{
              background: donutGradient,
            }"
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
            <i
              :style="{
                backgroundColor: item.color,
              }"
            />

            <span>{{ item.name }}</span>

            <strong>
              {{ item.value }}%
            </strong>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* -------------------------------------------------------------------------- */
/* Dashboard theme                                                            */
/* -------------------------------------------------------------------------- */

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

  /*
   * ใช้โทนเขียวตาม Theme
   * แทน destructive สีแดงเดิม
   */
  --accent-green:
    color-mix(
      in oklab,
      var(--primary) 68%,
      var(--chart-3, #84cc16)
    );

  --accent-green-soft:
    color-mix(
      in oklab,
      var(--primary) 52%,
      var(--chart-3, #84cc16)
    );

  --success-color: var(--primary);
  --danger-color: var(--accent-green);

  --warning-color:
    color-mix(
      in oklab,
      var(--primary) 78%,
      var(--chart-2, #22c55e)
    );

  --info-color:
    color-mix(
      in oklab,
      var(--primary) 82%,
      var(--chart-1, #14b8a6)
    );

  --neutral-color:
    color-mix(
      in oklab,
      var(--primary) 62%,
      var(--muted-foreground)
    );

  width: 100%;
  min-height: 100%;

  padding-bottom: 18px;

  overflow-x: auto;

  color: var(--text-main);
  background: var(--page-bg);

  font-family:
    "Sarabun",
    "Noto Sans Thai",
    Tahoma,
    Arial,
    sans-serif;
}

/* -------------------------------------------------------------------------- */
/* Page header                                                                */
/* -------------------------------------------------------------------------- */

.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  gap: 8px;

  margin-bottom: 16px;
}

/* -------------------------------------------------------------------------- */
/* Common heading                                                             */
/* -------------------------------------------------------------------------- */

.heading-group {
  display: flex;
  align-items: flex-start;

  min-width: 0;

  gap: 10px;
}

.title-marker {
  flex: 0 0 auto;

  width: 11px;
  height: 27px;

  border: 1px solid
    color-mix(
      in oklab,
      var(--primary-color) 70%,
      transparent
    );

  background: var(--primary-color);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;

  min-width: 1180px;

  margin-top: 11px;
  margin-bottom: 8px;
}

.section-header h2 {
  margin: 0;

  color: var(--title);

  font-size: 25px;
  font-weight: 700;
  line-height: 1.25;
}

.date-pill {
  padding: 3px 16px;

  border: 1px solid var(--card-border);
  border-radius: 999px;

  color: var(--text-main);
  background: var(--panel-bg);

  font-size: 16px;
  white-space: nowrap;
}

/* -------------------------------------------------------------------------- */
/* KPI                                                                        */
/* -------------------------------------------------------------------------- */

.summary-grid {
  display: grid;

  grid-template-columns:
    repeat(5, minmax(210px, 1fr));

  gap: 14px;

  min-width: 1180px;
}

.summary-card {
  min-height: 128px;

  padding: 14px 16px 12px;

  border: 1px solid var(--card-border);
  border-radius: 8px;

  background: var(--card-bg);

  text-align: center;
}

.summary-title {
  margin-bottom: 8px;

  color: var(--text-main);

  font-size: 18px;
  font-weight: 600;
}

.summary-value {
  font-size: 39px;
  font-weight: 500;
  line-height: 1.1;

  font-variant-numeric: tabular-nums;
}

.summary-value span {
  margin-left: 5px;

  font-size: 17px;
  font-weight: 700;
}

.summary-sub {
  margin-top: 11px;

  color: var(--text-muted);

  font-size: 17px;
  font-weight: 500;
}

/* -------------------------------------------------------------------------- */
/* Status colors                                                              */
/* -------------------------------------------------------------------------- */

.success {
  color: var(--success-color);
}

.danger {
  color: var(--danger-color);
}

.warning {
  color: var(--warning-color);
}

.info {
  color: var(--info-color);
}

.neutral {
  color: var(--neutral-color);
}

/* -------------------------------------------------------------------------- */
/* Content grid                                                               */
/* -------------------------------------------------------------------------- */

.content-grid {
  display: grid;

  grid-template-columns:
    minmax(620px, 1.95fr)
    minmax(320px, 1fr)
    minmax(320px, 1fr);

  gap: 10px;

  min-width: 1180px;
}

.panel {
  min-width: 0;
  min-height: 620px;

  padding: 11px;

  border: 1px solid var(--card-border);
  border-radius: 8px;

  color: var(--text-main);
  background: var(--panel-bg);
}

.map-section,
.source-section,
.refinery-section {
  display: flex;
  flex-direction: column;
}

.panel-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 10px;

  min-height: 39px;

  margin-bottom: 10px;
}

.panel-title-row h3 {
  margin: -1px 0 0;

  color: var(--title);

  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}

.panel-title-row > span {
  flex: 0 0 auto;

  margin-top: 3px;

  color: var(--text-muted);

  font-size: 13px;
  white-space: nowrap;
}

/* -------------------------------------------------------------------------- */
/* Import summary                                                             */
/* -------------------------------------------------------------------------- */

.import-cards {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 7px;

  margin-bottom: 10px;
}

.import-card {
  min-height: 126px;

  padding: 10px;

  border: 1px solid var(--card-border);
  border-radius: 7px;

  background:
    color-mix(
      in oklab,
      var(--panel-bg-deep) 55%,
      var(--panel-bg)
    );

  text-align: center;
}

.import-card > div {
  color: var(--text-main);

  font-size: 17px;
  font-weight: 500;
}

.import-card > strong {
  display: block;

  margin: 1px 0;

  font-size: 29px;
  font-weight: 500;
  line-height: 1.25;
}

.import-card p {
  margin: 1px 0;

  color: var(--text-main);

  font-size: 15px;
  font-weight: 600;
}

/* -------------------------------------------------------------------------- */
/* Map                                                                        */
/* -------------------------------------------------------------------------- */

.map-frame {
  position: relative;
  z-index: 0;

  width: 100%;
  height: 378px;

  overflow: hidden;

  border: 1px solid var(--card-border);
  border-radius: 8px;

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

:deep(.world-map .leaflet-map-pane) {
  z-index: 0;
}

:deep(.world-map .leaflet-tile-pane) {
  z-index: 200;
}

:deep(.world-map .leaflet-overlay-pane) {
  z-index: 400;
}

:deep(.world-map .leaflet-marker-pane) {
  z-index: 600;
}

:deep(.world-map .leaflet-tooltip-pane) {
  z-index: 650;
}

:deep(.world-map .leaflet-control-container) {
  position: relative;
  z-index: 800;
}

:deep(.world-map .leaflet-top),
:deep(.world-map .leaflet-bottom) {
  z-index: 800;
}

:deep(.world-map .leaflet-tile) {
  backface-visibility: hidden;
}

:deep(.world-map .leaflet-control-zoom) {
  overflow: hidden;

  border: 1px solid var(--card-border);
  border-radius: 7px;

  box-shadow:
    0 2px 8px
    color-mix(
      in oklab,
      var(--foreground) 15%,
      transparent
    );
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
  background:
    color-mix(
      in oklab,
      var(--panel-bg) 90%,
      transparent
    );

  font-size: 10px;
}

:deep(.world-map .leaflet-control-attribution a) {
  color: var(--primary-color);
}

:deep(.world-map .leaflet-control-scale-line) {
  border-color: var(--text-main);

  color: var(--text-main);
  background:
    color-mix(
      in oklab,
      var(--panel-bg) 82%,
      transparent
    );

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

  box-shadow:
    0 10px 26px
    color-mix(
      in oklab,
      var(--foreground) 22%,
      transparent
    );
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

  border: 2px solid
    color-mix(
      in oklab,
      var(--primary-color) 75%,
      white
    );
  border-radius: 999px;

  background:
    color-mix(
      in oklab,
      var(--primary-color) 88%,
      black
    );

  box-shadow:
    0 0 0 4px
    color-mix(
      in oklab,
      var(--primary-color) 24%,
      transparent
    ),
    0 4px 10px
    color-mix(
      in oklab,
      var(--foreground) 25%,
      transparent
    );
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

  box-shadow:
    0 2px 7px
    color-mix(
      in oklab,
      var(--foreground) 20%,
      transparent
    );

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

  grid-template-columns:
    92px minmax(0, 1fr);

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
  background:
    color-mix(
      in oklab,
      var(--panel-bg) 78%,
      transparent
    );

  font-size: 14px;
  font-weight: 700;

  backdrop-filter: blur(2px);
}

/* -------------------------------------------------------------------------- */
/* Vessel map status                                                          */
/* -------------------------------------------------------------------------- */

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
  flex-wrap: wrap;
  align-items: center;

  gap: 8px 14px;

  min-width: 0;

  color: var(--text-muted);

  font-size: 12px;
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

  box-shadow:
    0 0 0 4px
    color-mix(
      in oklab,
      var(--success-color) 18%,
      transparent
    );
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

  min-height: 32px;

  padding: 5px 12px;

  border: 1px solid
    color-mix(
      in oklab,
      var(--primary-color) 55%,
      var(--card-border)
    );
  border-radius: 6px;

  color: var(--primary-color);
  background:
    color-mix(
      in oklab,
      var(--primary-color) 9%,
      var(--panel-bg)
    );

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
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.45;
    transform: scale(0.82);
  }
}

/* -------------------------------------------------------------------------- */
/* Source bars                                                                */
/* -------------------------------------------------------------------------- */

.source-list {
  flex: 1;

  margin-top: 4px;
}

.source-item {
  margin-bottom: 9px;
}

.source-label {
  margin-bottom: 3px;

  color: var(--text-main);

  font-size: 17px;
  font-weight: 600;
}

.progress-track {
  width: 100%;
  height: 19px;

  overflow: hidden;

  border-radius: 999px;

  background: var(--track);
}

.progress-fill {
  height: 100%;

  border-radius: inherit;

  transition:
    width 200ms ease,
    background-color 200ms ease;
}

.progress-fill.other {
  background: var(--primary-color);
}

.progress-fill.middle-east {
  background: var(--accent-green);
}

.source-legend {
  display: grid;

  gap: 12px;

  padding: 8px 0 17px;

  color: var(--text-main);

  font-size: 15px;
}

.source-legend span {
  display: flex;
  align-items: center;

  gap: 12px;
}

.legend-dot {
  display: block;

  width: 22px;
  height: 22px;

  border-radius: 999px;
}

.other-dot {
  background: var(--primary-color);
}

.middle-east-dot {
  background: var(--accent-green);
}

/* -------------------------------------------------------------------------- */
/* Donut                                                                      */
/* -------------------------------------------------------------------------- */

.donut-wrap {
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 350px;
}

.donut {
  position: relative;

  width: min(305px, 82%);

  aspect-ratio: 1;

  border-radius: 50%;

  transition: background 200ms ease;
}

.donut-hole {
  position: absolute;
  inset: 20%;

  display: grid;
  align-content: center;
  justify-items: center;

  gap: 4px;

  border-radius: 50%;

  color: var(--text-main);
  background: var(--panel-bg);

  font-size: 18px;
  font-weight: 500;
}

.donut-legend {
  display: grid;

  gap: 10px;

  width: fit-content;

  margin: 2px auto 0;
}

.donut-legend-row {
  display: grid;

  grid-template-columns:
    23px auto auto;

  align-items: center;

  gap: 12px;

  color: var(--text-main);

  font-size: 16px;
}

.donut-legend-row i {
  display: block;

  width: 23px;
  height: 23px;

  border-radius: 999px;
}

.donut-legend-row strong {
  margin-left: -5px;
}

/* -------------------------------------------------------------------------- */
/* Theme transition                                                           */
/* -------------------------------------------------------------------------- */

.reserve-dashboard,
.summary-card,
.import-card,
.panel,
.date-pill,
.progress-track,
.progress-fill,
.legend-dot,
.refresh-vessel-button,
.donut-hole,
.donut-legend-row i {
  transition:
    color 200ms ease,
    background-color 200ms ease,
    border-color 200ms ease,
    box-shadow 200ms ease;
}

/* -------------------------------------------------------------------------- */
/* Responsive                                                                 */
/* -------------------------------------------------------------------------- */

@media (max-width: 1280px) {
  .summary-grid,
  .section-header,
  .content-grid {
    min-width: 1120px;
  }

  .content-grid {
    grid-template-columns:
      minmax(590px, 1.95fr)
      minmax(300px, 1fr)
      minmax(300px, 1fr);
  }
}
</style>