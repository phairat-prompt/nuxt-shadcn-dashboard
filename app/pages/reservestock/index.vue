<script setup lang="ts">
import { computed } from 'vue'

import thailandMapSvgRaw from '~/assets/maps/thailand-map.svg?raw'

type ReserveKey =
  | 'procurement'
  | 'transit'
  | 'legal'
  | 'trade'

interface ReserveItem {
  key: ReserveKey
  name: string
  percent: number
  volume: number
  color: string
}

interface DonutSegment extends ReserveItem {
  offset: number
}

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
/* Thailand SVG                                                               */
/* -------------------------------------------------------------------------- */

const thailandMapMarkup = thailandMapSvgRaw
  .replace(/<\?xml[\s\S]*?\?>/gi, '')
  .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
  .replace(/\son\w+="[^"]*"/gi, '')
  .replace(/\son\w+='[^']*'/gi, '')
  .replace(/javascript:/gi, '')
  .trim()

/* -------------------------------------------------------------------------- */
/* Dashboard data                                                             */
/* -------------------------------------------------------------------------- */

const reserveItems: ReserveItem[] = [
  {
    key: 'procurement',
    name: 'น้ำมันสำรองยืนยันการจัดหา',
    percent: 22,
    volume: 3239,
    color: 'var(--reserve-procurement)',
  },
  {
    key: 'transit',
    name: 'น้ำมันสำรองอยู่ระหว่างขนส่ง',
    percent: 36,
    volume: 5120,
    color: 'var(--reserve-transit)',
  },
  {
    key: 'legal',
    name: 'น้ำมันสำรองตามกฎหมาย',
    percent: 23,
    volume: 3354,
    color: 'var(--reserve-legal)',
  },
  {
    key: 'trade',
    name: 'น้ำมันสำรองเพื่อการค้า',
    percent: 19,
    volume: 2729,
    color: 'var(--reserve-trade)',
  },
]

/*
 * เรียงตามต้นฉบับ:
 * แดงบนขวา → ฟ้าล่างขวา → เทาล่างซ้าย → เหลืองบนซ้าย
 */
const donutOrder: ReserveKey[] = [
  'legal',
  'trade',
  'transit',
  'procurement',
]

const legendOrder: ReserveKey[] = [
  'transit',
  'legal',
  'procurement',
  'trade',
]

const totalVolume = computed(() => {
  return reserveItems.reduce(
    (total, item) => total + item.volume,
    0,
  )
})

const donutSegments = computed<DonutSegment[]>(() => {
  let offset = 0

  return donutOrder
    .map(key =>
      reserveItems.find(item => item.key === key),
    )
    .filter(
      (item): item is ReserveItem =>
        item !== undefined,
    )
    .map((item) => {
      const segment: DonutSegment = {
        ...item,
        offset,
      }

      offset += item.percent

      return segment
    })
})

const legendItems = computed(() => {
  return legendOrder
    .map(key =>
      reserveItems.find(item => item.key === key),
    )
    .filter(
      (item): item is ReserveItem =>
        item !== undefined,
    )
})

const itemByKey = computed(() => {
  return reserveItems.reduce(
    (result, item) => {
      result[item.key] = item
      return result
    },
    {} as Record<ReserveKey, ReserveItem>,
  )
})

function formatVolume(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}
</script>

<template>
  <div
    class="reserve-stock-page"
    :class="themeClass"
  >
    <!-- Page header -->
    <div class="page-header">
      <h2 class="text-2xl font-bold tracking-tight">
        Reserve Stock
      </h2>

      <div class="flex items-center space-x-2">
        <BaseDateRangePicker />
        <!-- <Button>Download</Button> -->
      </div>
    </div>

    <main class="reserve-panel">
      <!-- Panel heading -->
      <header class="panel-header">
        <div class="panel-heading">
          <span class="title-marker" />

          <div>
            <h2>
              สัดส่วนปริมาณน้ำมันสำรองภายในประเทศ
            </h2>

            <p>
              แสดงสัดส่วนน้ำมันทั้ง 4 ส่วนเทียบ 100%
            </p>
          </div>
        </div>
      </header>

      <section class="visual-layout">
        <!-- Chart -->
        <section class="chart-stage">
          <!-- Top left -->
          <article
            class="callout callout-procurement"
            :style="{
              color: itemByKey.procurement.color,
            }"
          >
            <b>
              {{ itemByKey.procurement.name }}
            </b>

            <span>
              ({{ itemByKey.procurement.percent }}%,
              {{ formatVolume(itemByKey.procurement.volume) }} ML)
            </span>
          </article>

          <!-- Donut -->
          <div class="donut-wrap">
            <div class="donut-chart">
              <svg
                viewBox="0 0 100 100"
                class="donut-svg"
                role="img"
                aria-label="กราฟสัดส่วนปริมาณน้ำมันสำรองภายในประเทศ"
              >
                <!-- Background -->
                <circle
                  cx="50"
                  cy="50"
                  r="39"
                  pathLength="100"
                  fill="none"
                  stroke="var(--donut-track)"
                  stroke-width="22"
                />

                <!-- Segments -->
                <g transform="rotate(-90 50 50)">
                  <circle
                    v-for="item in donutSegments"
                    :key="item.key"
                    cx="50"
                    cy="50"
                    r="39"
                    pathLength="100"
                    fill="none"
                    :stroke="item.color"
                    stroke-width="22"
                    stroke-linecap="butt"
                    :stroke-dasharray="
                      `${item.percent} ${100 - item.percent}`
                    "
                    :stroke-dashoffset="-item.offset"
                    class="donut-segment"
                    :style="{
                      color: item.color,
                    }"
                  >
                    <title>
                      {{ item.name }}:
                      {{ item.percent }}%,
                      {{ formatVolume(item.volume) }} ML
                    </title>
                  </circle>
                </g>
              </svg>

              <div class="donut-center">
                <strong>
                  {{ formatVolume(totalVolume) }} ML
                </strong>

                <span>ปริมาณรวม</span>

                <small>(Total Volume)</small>
              </div>
            </div>
          </div>

          <!-- Top right -->
          <article
            class="callout callout-legal"
            :style="{
              color: itemByKey.legal.color,
            }"
          >
            <b>
              {{ itemByKey.legal.name }}
            </b>

            <span>
              ({{ itemByKey.legal.percent }}%,
              {{ formatVolume(itemByKey.legal.volume) }} ML)
            </span>
          </article>

          <!-- Bottom left -->
          <article
            class="callout callout-transit"
            :style="{
              color: itemByKey.transit.color,
            }"
          >
            <b>
              {{ itemByKey.transit.name }}
            </b>

            <span>
              ({{ itemByKey.transit.percent }}%,
              {{ formatVolume(itemByKey.transit.volume) }} ML)
            </span>
          </article>

          <!-- Bottom right -->
          <article
            class="callout callout-trade"
            :style="{
              color: itemByKey.trade.color,
            }"
          >
            <b>
              {{ itemByKey.trade.name }}
            </b>

            <span>
              ({{ itemByKey.trade.percent }}%,
              {{ formatVolume(itemByKey.trade.volume) }} ML)
            </span>
          </article>
        </section>

        <!-- Map and legend -->
        <section class="map-stage">
          <div class="thai-map">
            <div
              class="thai-map-svg"
              role="img"
              aria-label="แผนที่ประเทศไทยแยกรายจังหวัด"
              v-html="thailandMapMarkup"
            />

            <div class="map-caption">
              ประเทศไทย
            </div>
          </div>

          <aside class="legend-box">
            <div class="legend-title">
              สัดส่วนปริมาณสำรอง
            </div>

            <div
              v-for="item in legendItems"
              :key="item.key"
              class="legend-row"
            >
              <i
                :style="{
                  backgroundColor: item.color,
                }"
              />

              <span>
                {{ item.name }}
              </span>

              <strong>
                {{ item.percent }}%
              </strong>
            </div>
          </aside>
        </section>
      </section>

      <footer class="scale-text">
        Scale 1 Barrel = 500 Million Liters
      </footer>
    </main>
  </div>
</template>

<style scoped>
/* -------------------------------------------------------------------------- */
/* Theme                                                                      */
/* -------------------------------------------------------------------------- */

.reserve-stock-page {
  --page-bg: var(--background);
  --panel-bg: var(--card);
  --panel-border: var(--border);

  --text-main: var(--foreground);
  --text-muted: var(--muted-foreground);
  --title: var(--foreground);

  --primary-color: var(--primary);

  /*
   * สีข้อมูลอ้างอิง Theme หลัก
   * จะเปลี่ยนตาม Light/Dark และ Accent Color
   */
  --reserve-procurement:
    color-mix(
      in oklab,
      var(--chart-3) 78%,
      var(--primary)
    );

  --reserve-transit:
    color-mix(
      in oklab,
      var(--muted-foreground) 78%,
      var(--foreground)
    );

  --reserve-legal: var(--destructive);

  --reserve-trade:
    color-mix(
      in oklab,
      var(--chart-1) 72%,
      var(--primary)
    );

  --donut-track:
    color-mix(
      in oklab,
      var(--muted) 76%,
      transparent
    );

  --map-fill:
    color-mix(
      in oklab,
      var(--muted) 72%,
      var(--muted-foreground)
    );

  --map-stroke:
    color-mix(
      in oklab,
      var(--muted-foreground) 58%,
      transparent
    );

  --map-shadow:
    color-mix(
      in oklab,
      var(--foreground) 18%,
      transparent
    );

  --bangkok-fill: var(--reserve-procurement);
  --bangkok-stroke: var(--card);

  width: 100%;
  min-width: 0;
  min-height: 100%;

  padding-bottom: 18px;

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
/* Header                                                                     */
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
/* Main panel                                                                 */
/* -------------------------------------------------------------------------- */

.reserve-panel {
  position: relative;

  width: 100%;
  min-width: 0;

  padding: 20px 22px 14px;

  overflow: hidden;

  border: 1px solid var(--panel-border);
  border-radius: 10px;

  color: var(--text-main);
  background: var(--panel-bg);

  box-sizing: border-box;

  box-shadow:
    0 1px 2px
    color-mix(
      in oklab,
      var(--foreground) 5%,
      transparent
    );

  isolation: isolate;
}

/* -------------------------------------------------------------------------- */
/* Heading                                                                    */
/* -------------------------------------------------------------------------- */

.panel-header {
  position: relative;
  z-index: 5;

  margin-bottom: 4px;
}

.panel-heading {
  display: flex;
  align-items: flex-start;

  gap: 12px;
}

.title-marker {
  flex: 0 0 auto;

  width: 11px;
  height: 29px;

  margin-top: 1px;

  border: 1px solid
    color-mix(
      in oklab,
      var(--primary-color) 70%,
      transparent
    );

  background: var(--primary-color);
}

.panel-header h2 {
  margin: 0 0 7px;

  color: var(--title);

  font-size: clamp(20px, 1.35vw, 28px);
  font-weight: 700;
  line-height: 1.25;
}

.panel-header p {
  margin: 0;

  color: var(--text-muted);

  font-size: clamp(14px, 0.95vw, 17px);
}

/* -------------------------------------------------------------------------- */
/* Visual layout                                                              */
/* -------------------------------------------------------------------------- */

.visual-layout {
  display: grid;

  grid-template-columns:
    minmax(780px, 1.65fr)
    minmax(380px, 0.8fr);

  align-items: center;

  gap: 20px;

  width: 100%;
  min-width: 0;
  min-height: 650px;
}

/* -------------------------------------------------------------------------- */
/* Chart area                                                                 */
/* -------------------------------------------------------------------------- */

.chart-stage {
  display: grid;

  grid-template-columns:
    minmax(160px, 230px)
    minmax(440px, 620px)
    minmax(160px, 230px);

  grid-template-rows:
    minmax(0, 1fr)
    minmax(0, 1fr);

  grid-template-areas:
    "procurement donut legal"
    "transit donut trade";

  align-items: center;
  justify-content: center;

  column-gap: 18px;
  row-gap: 20px;

  width: 100%;
  min-width: 0;
  min-height: 650px;

  overflow: visible;
}

/* -------------------------------------------------------------------------- */
/* Donut                                                                      */
/* -------------------------------------------------------------------------- */

.donut-wrap {
  grid-area: donut;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-width: 0;
  height: 100%;
}

.donut-chart {
  position: relative;

  width: min(100%, 620px);
  min-width: 0;

  aspect-ratio: 1;

  isolation: isolate;
}

.donut-svg {
  display: block;

  width: 100%;
  height: 100%;

  overflow: visible;
}

.donut-segment {
  cursor: pointer;

  transition:
    opacity 180ms ease,
    stroke-width 180ms ease,
    filter 180ms ease;
}

.donut-segment:hover {
  stroke-width: 24;

  filter:
    drop-shadow(
      0 0 3px
      currentColor
    );
}

.donut-svg:hover .donut-segment:not(:hover) {
  opacity: 0.64;
}

.donut-center {
  position: absolute;

  inset: 21%;

  display: grid;
  place-content: center;
  justify-items: center;

  border-radius: 50%;

  color: var(--text-main);
  background: var(--panel-bg);

  text-align: center;

  pointer-events: none;

  transition:
    color 180ms ease,
    background-color 180ms ease;
}

.donut-center strong {
  margin-bottom: 10px;

  color: var(--title);

  font-size: clamp(34px, 2.8vw, 54px);
  font-weight: 700;
  line-height: 1;

  white-space: nowrap;
}

.donut-center span {
  margin-bottom: 8px;

  font-size: clamp(20px, 1.35vw, 28px);
  font-weight: 500;
}

.donut-center small {
  color: var(--text-muted);

  font-size: clamp(16px, 1vw, 21px);
}

/* -------------------------------------------------------------------------- */
/* Callouts — ไม่มีเส้น                                                      */
/* -------------------------------------------------------------------------- */

.callout {
  display: grid;

  gap: 6px;

  width: 100%;
  min-width: 0;
  max-width: 230px;

  padding: 8px;

  font-size: clamp(15px, 1vw, 21px);
  font-weight: 700;
  line-height: 1.3;

  overflow-wrap: anywhere;
}

.callout span {
  font-size: 0.92em;

  font-variant-numeric: tabular-nums;
}

.callout-procurement {
  grid-area: procurement;

  justify-self: end;

  text-align: right;
}

.callout-legal {
  grid-area: legal;

  justify-self: start;

  text-align: left;
}

.callout-transit {
  grid-area: transit;

  justify-self: end;

  text-align: right;
}

.callout-trade {
  grid-area: trade;

  justify-self: start;

  text-align: left;
}

/* -------------------------------------------------------------------------- */
/* Map stage                                                                  */
/* -------------------------------------------------------------------------- */

.map-stage {
  position: relative;

  width: 100%;
  min-width: 0;
  height: 580px;

  overflow: hidden;

  isolation: isolate;
  contain: paint;
}

.thai-map {
  position: absolute;

  top: 12px;
  left: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 290px;
  height: 520px;

  pointer-events: none;
}

.thai-map-svg {
  display: grid;
  place-items: center;

  width: 100%;
  height: 100%;

  filter:
    drop-shadow(
      0 8px 10px
      var(--map-shadow)
    );
}

.thai-map-svg :deep(svg) {
  display: block;

  width: 100%;
  height: 100%;

  overflow: visible;
}

.thai-map-svg :deep(path),
.thai-map-svg :deep(polygon) {
  fill: var(--map-fill) !important;
  stroke: var(--map-stroke) !important;

  stroke-width: 0.75;
  stroke-linecap: round;
  stroke-linejoin: round;

  vector-effect: non-scaling-stroke;

  transition:
    fill 180ms ease,
    stroke 180ms ease;
}

.thai-map-svg :deep(g) {
  fill: var(--map-fill);
  stroke: var(--map-stroke);
}

.thai-map-svg :deep(#TH-10),
.thai-map-svg :deep(.TH-10),
.thai-map-svg :deep([data-code="TH-10"]) {
  fill: var(--bangkok-fill) !important;
  stroke: var(--bangkok-stroke) !important;

  stroke-width: 1.5;
}

.map-caption {
  margin-top: -6px;

  color: var(--text-muted);

  font-size: 15px;
  font-weight: 700;
  text-align: center;
}

/* -------------------------------------------------------------------------- */
/* Legend                                                                     */
/* -------------------------------------------------------------------------- */

.legend-box {
  position: absolute;
  z-index: 3;

  top: 200px;
  right: 0;

  display: grid;

  gap: 13px;

  width: min(100%, 380px);
}

.legend-title {
  margin-bottom: 3px;

  color: var(--title);

  font-size: 18px;
  font-weight: 700;
}

.legend-row {
  display: grid;

  grid-template-columns:
    28px
    minmax(0, 1fr)
    auto;

  align-items: center;

  gap: 11px;

  color: var(--text-main);

  font-size: clamp(14px, 0.9vw, 17px);
}

.legend-row i {
  display: block;

  width: 28px;
  height: 20px;

  border-radius: 4px;
}

.legend-row strong {
  font-variant-numeric: tabular-nums;
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

.scale-text {
  position: relative;
  z-index: 5;

  margin-top: 2px;

  color: var(--text-muted);

  font-size: 14px;
}

/* -------------------------------------------------------------------------- */
/* Responsive                                                                 */
/* -------------------------------------------------------------------------- */

@media (max-width: 1600px) {
  .visual-layout {
    grid-template-columns:
      minmax(700px, 1fr)
      minmax(320px, 390px);

    gap: 12px;
  }

  .chart-stage {
    grid-template-columns:
      minmax(130px, 190px)
      minmax(400px, 540px)
      minmax(130px, 190px);

    min-height: 610px;

    column-gap: 10px;
  }

  .donut-chart {
    width: min(100%, 540px);
  }

  .callout {
    max-width: 190px;

    font-size: 15px;
  }

  .thai-map {
    width: 245px;
    height: 455px;
  }
}

@media (max-width: 1280px) {
  .visual-layout {
    grid-template-columns: minmax(0, 1fr);

    gap: 26px;

    min-height: auto;
  }

  .chart-stage {
    width: 100%;
    max-width: 960px;

    margin: 0 auto;
  }

  .map-stage {
    display: grid;

    grid-template-columns:
      minmax(210px, 290px)
      minmax(300px, 1fr);

    align-items: center;

    gap: 28px;

    width: 100%;
    max-width: 760px;
    height: auto;

    margin: 0 auto;

    overflow: visible;

    contain: layout;
  }

  .thai-map,
  .legend-box {
    position: relative;

    top: auto;
    right: auto;
    bottom: auto;
    left: auto;
  }

  .thai-map {
    width: 240px;
    height: 430px;

    justify-self: center;
  }

  .legend-box {
    width: 100%;

    align-self: center;
  }
}

@media (max-width: 760px) {
  .reserve-panel {
    padding: 16px 14px;
  }

  .chart-stage {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    grid-template-rows: auto;

    grid-template-areas:
      "donut donut"
      "procurement legal"
      "transit trade";

    gap: 10px;

    min-height: auto;
  }

  .donut-wrap {
    min-height: 440px;
  }

  .donut-chart {
    width: min(88vw, 440px);
  }

  .callout {
    max-width: none;

    padding: 11px 12px;

    border: 1px solid currentColor;
    border-radius: 8px;

    background:
      color-mix(
        in oklab,
        currentColor 7%,
        var(--panel-bg)
      );

    font-size: 15px;
    text-align: left;
  }

  .callout-procurement,
  .callout-legal,
  .callout-transit,
  .callout-trade {
    justify-self: stretch;

    text-align: left;
  }

  .map-stage {
    grid-template-columns: 1fr;

    gap: 20px;
  }

  .thai-map {
    width: 195px;
    height: 365px;
  }

  .legend-box {
    width: 100%;
    max-width: 620px;
  }
}

@media (max-width: 520px) {
  .panel-heading {
    gap: 9px;
  }

  .title-marker {
    width: 8px;
    height: 25px;
  }

  .panel-header h2 {
    font-size: 19px;
  }

  .chart-stage {
    grid-template-columns: 1fr;

    grid-template-areas:
      "donut"
      "procurement"
      "legal"
      "transit"
      "trade";
  }

  .donut-wrap {
    min-height: 330px;
  }

  .donut-chart {
    width: min(90vw, 320px);
  }

  .donut-center strong {
    font-size: 27px;
  }

  .donut-center span {
    font-size: 17px;
  }

  .donut-center small {
    font-size: 13px;
  }

  .thai-map {
    width: 165px;
    height: 310px;
  }

  .map-caption {
    display: none;
  }

  .legend-row {
    grid-template-columns:
      26px
      minmax(0, 1fr)
      auto;

    gap: 8px;

    font-size: 14px;
  }

  .legend-row i {
    width: 26px;
    height: 18px;
  }
}
</style>