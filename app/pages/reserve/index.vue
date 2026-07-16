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
  CircleMarker,
  LatLngExpression,
  Map as LeafletMap,
  Polyline,
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
    color: 'var(--destructive)',
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
/* Leaflet map                                                                */
/* -------------------------------------------------------------------------- */

type RouteType = 'green' | 'red' | 'blue'

interface RouteLayer {
  layer: Polyline
  type: RouteType
}

const worldMapEl = ref<HTMLDivElement | null>(null)

let worldMap: LeafletMap | null = null

let lightTileLayer: TileLayer | null = null
let darkTileLayer: TileLayer | null = null

let resizeObserver: ResizeObserver | null = null
let resizeFrame = 0

const routeLayers: RouteLayer[] = []
const sourceMarkers: CircleMarker[] = []

let thailandMarker: CircleMarker | null = null

const thailandPosition: LatLngExpression = [
  13.7563,
  100.5018,
]

const mapPalettes = {
  light: {
    green: '#059669',
    red: '#e11d48',
    blue: '#0284c7',

    sourceFill: '#ffffff',
    sourceStroke: '#334155',

    hubFill: '#ffffff',
    hubStroke: '#0284c7',
  },

  dark: {
    green: '#35f59a',
    red: '#ff4f7d',
    blue: '#28baf2',

    sourceFill: '#f8fafc',
    sourceStroke: '#dbeafe',

    hubFill: '#f8fafc',
    hubStroke: '#38bdf8',
  },
}

const routeDefinitions: Array<{
  type: RouteType
  points: LatLngExpression[]
}> = [
  {
    type: 'red',
    points: [
      [26.56, 56.25],
      [24, 66],
      [20, 76],
      [16, 88],
      thailandPosition,
    ],
  },
  {
    type: 'blue',
    points: [
      [12.58, 43.33],
      [8, 57],
      [7, 72],
      [10, 87],
      thailandPosition,
    ],
  },
  {
    type: 'green',
    points: [
      [29, -90],
      [20, -65],
      [10, -40],
      [5, -10],
      [4, 25],
      [7, 50],
      [10, 75],
      thailandPosition,
    ],
  },
  {
    type: 'green',
    points: [
      [7, -10],
      [1, 20],
      [3, 45],
      [8, 70],
      thailandPosition,
    ],
  },
  {
    type: 'red',
    points: [
      [-23, 135],
      [-10, 125],
      [0, 115],
      [8, 106],
      thailandPosition,
    ],
  },
]

const sourcePoints: Array<{
  name: string
  position: LatLngExpression
  direction: 'top' | 'bottom' | 'left' | 'right'
}> = [
  {
    name: 'Hormuz',
    position: [26.56, 56.25],
    direction: 'top',
  },
  {
    name: 'Bab-Al Mandab',
    position: [12.58, 43.33],
    direction: 'bottom',
  },
  {
    name: 'Far East Asia / Oceania',
    position: [-23, 135],
    direction: 'left',
  },
  {
    name: 'America / West Africa',
    position: [7, -10],
    direction: 'top',
  },
]

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

  /*
   * เพิ่ม Light และ Dark ไว้พร้อมกัน
   * เปลี่ยน Theme ด้วย opacity จึงไม่โหลดแผนที่ใหม่
   */
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

function addRouteLayers(
  L: typeof import('leaflet'),
) {
  if (!worldMap)
    return

  routeDefinitions.forEach((route) => {
    const palette = themeClass.value === 'dark'
      ? mapPalettes.dark
      : mapPalettes.light

    const layer = L.polyline(route.points, {
      color: palette[route.type],
      weight: 4,
      opacity: 0.94,
      smoothFactor: 1.4,
      lineCap: 'round',
      lineJoin: 'round',
      interactive: false,
      className: `oil-route route-${route.type}`,
    }).addTo(worldMap as LeafletMap)

    routeLayers.push({
      layer,
      type: route.type,
    })
  })
}

function addMapPoints(
  L: typeof import('leaflet'),
) {
  if (!worldMap)
    return

  const palette = themeClass.value === 'dark'
    ? mapPalettes.dark
    : mapPalettes.light

  sourcePoints.forEach((point) => {
    const marker = L.circleMarker(
      point.position,
      {
        radius: 6,

        color: palette.sourceStroke,
        weight: 2,

        fillColor: palette.sourceFill,
        fillOpacity: 1,

        interactive: false,
      },
    )
      .bindTooltip(point.name, {
        permanent: true,
        direction: point.direction,
        offset: [0, -8],
        className: 'map-route-label',
      })
      .addTo(worldMap as LeafletMap)

    sourceMarkers.push(marker)
  })

  thailandMarker = L.circleMarker(
    thailandPosition,
    {
      radius: 10,

      color: palette.hubStroke,
      weight: 4,

      fillColor: palette.hubFill,
      fillOpacity: 1,

      interactive: false,
    },
  )
    .bindTooltip('ประเทศไทย', {
      permanent: true,
      direction: 'bottom',
      offset: [0, 12],
      className:
        'map-route-label map-hub-label',
    })
    .addTo(worldMap)
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

  const palette = isDark
    ? mapPalettes.dark
    : mapPalettes.light

  /*
   * ไม่ลบ Tile Layer
   * ปรับ opacity เท่านั้น ป้องกันแผนที่กระพริบ
   */
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

  routeLayers.forEach(({ layer, type }) => {
    layer.setStyle({
      color: palette[type],
      weight: 4,
      opacity: 0.94,
    })

    layer.bringToFront()
  })

  sourceMarkers.forEach((marker) => {
    marker.setStyle({
      color: palette.sourceStroke,
      fillColor: palette.sourceFill,
      weight: 2,
      fillOpacity: 1,
    })

    marker.bringToFront()
  })

  thailandMarker?.setStyle({
    color: palette.hubStroke,
    fillColor: palette.hubFill,
    weight: 4,
    fillOpacity: 1,
  })

  thailandMarker?.bringToFront()
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

  worldMap = L.map(
    worldMapEl.value,
    {
      center: [14, 65],
      zoom: 2,

      minZoom: 2,
      maxZoom: 8,

      zoomControl: true,
      attributionControl: true,

      worldCopyJump: true,

      /*
       * ลดการกระพริบระหว่างเปลี่ยน Theme
       */
      fadeAnimation: false,
      zoomAnimation: true,
      markerZoomAnimation: true,

      /*
       * ใช้ Pane มาตรฐานของ Leaflet
       * ไม่สร้าง z-index ใหม่
       */
      preferCanvas: false,
    },
  )

  createTileLayers(L)
  addRouteLayers(L)
  addMapPoints(L)

  worldMap.fitBounds(
    L.latLngBounds([
      [-38, -125],
      [52, 160],
    ]),
    {
      padding: [24, 24],
      animate: false,
    },
  )

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

/*
 * เปลี่ยนเฉพาะสีและ Tile
 * ไม่ invalidateSize ขณะเปิด Customizer
 * จึงไม่ทำให้แผนที่ลอยหรือขยายทับหน้าจอ
 */
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
})

onBeforeUnmount(() => {
  cancelAnimationFrame(resizeFrame)

  resizeObserver?.disconnect()
  resizeObserver = null

  worldMap?.remove()
  worldMap = null

  lightTileLayer = null
  darkTileLayer = null

  thailandMarker = null

  routeLayers.length = 0
  sourceMarkers.length = 0
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
        <!-- <Button>Download</Button> -->
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

        <!-- Map wrapper -->
        <div class="map-frame">
          <div
            ref="worldMapEl"
            class="world-map"
            role="img"
            aria-label="แผนที่เส้นทางการนำเข้าน้ำมันดิบเข้าสู่ประเทศไทย"
          />
        </div>

        <div class="map-legend">
          <span>
            <i class="map-legend-line green-line" />
            America / West Africa
          </span>

          <span>
            <i class="map-legend-line red-line" />
            Middle East / Far East
          </span>

          <span>
            <i class="map-legend-line blue-line" />
            Bab-Al Mandab
          </span>
        </div>
      </section>

      <!-- Source panel -->
      <section class="panel source-section">
        <div class="panel-title-row">
          <div class="heading-group">
            <div class="title-marker" />

            <h3>
              ปริมาณน้ำมันดิบที่นำเข้าแยกตามแหล่งต้นทาง
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

  --success-color: var(--chart-2);
  --danger-color: var(--destructive);
  --warning-color: var(--chart-3);
  --info-color: var(--primary);
  --neutral-color: var(--chart-4);

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
  /*
   * จำกัด stacking context ของ Leaflet
   * ไม่ให้ pane หรือ control ลอยทับ Template Customizer
   */
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

:deep(.world-map .map-route-label) {
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

  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

:deep(.world-map .map-route-label::before) {
  display: none;
}

:deep(.world-map .map-hub-label) {
  border-color: var(--primary-color);

  color: var(--primary-color);

  font-size: 12px;
  font-weight: 800;
}

:deep(.world-map .oil-route) {
  filter: drop-shadow(0 0 3px currentColor);
}

/* -------------------------------------------------------------------------- */
/* Map legend                                                                 */
/* -------------------------------------------------------------------------- */

.map-legend {
  display: flex;
  flex-wrap: wrap;

  gap: 10px 18px;

  margin-top: 9px;

  color: var(--text-muted);

  font-size: 12px;
}

.map-legend span {
  display: inline-flex;
  align-items: center;

  gap: 7px;
}

.map-legend-line {
  width: 28px;
  height: 4px;

  border-radius: 999px;
}

.green-line {
  background: #059669;
}

.red-line {
  background: #e11d48;
}

.blue-line {
  background: #0284c7;
}

.reserve-dashboard.dark .green-line {
  background: #35f59a;
}

.reserve-dashboard.dark .red-line {
  background: #ff4f7d;
}

.reserve-dashboard.dark .blue-line {
  background: #28baf2;
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
}

.progress-fill.other {
  background: var(--primary-color);
}

.progress-fill.middle-east {
  background: var(--danger-color);
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
  background: var(--danger-color);
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