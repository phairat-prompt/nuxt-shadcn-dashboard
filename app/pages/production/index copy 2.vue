<script setup lang="ts">
import { computed } from 'vue'

type KpiItem = {
  title: string
  value: string
  unit: string
  subtitle: string
  percent: number
  tone: string
}

type SourceItem = {
  label: string
  value: number
}

type TransportItem = {
  icon: string
  label: string
  value: number
}

type SalesRow = {
  icon: string
  name: string
  note?: string
  avg: number
  value: number
}

const kpiCards: KpiItem[] = [
  {
    title: 'น้ำมันดิบเข้ากลั่น',
    value: '176.806',
    unit: 'ลล.',
    subtitle: 'Crude Oil Intake',
    percent: 100,
    tone: 'var(--chart-primary)',
  },
  {
    title: 'ผลิตดีเซลพื้นฐาน',
    value: '72.721',
    unit: 'ลล.',
    subtitle: 'Refinery Output',
    percent: 41,
    tone: 'var(--chart-secondary)',
  },
  {
    title: 'ผลิตดีเซลหมุนเร็ว',
    value: '31.432',
    unit: 'ลล.',
    subtitle: 'Major Traders',
    percent: 43,
    tone: 'var(--chart-primary)',
  },
  {
    title: 'จำหน่ายปลายทาง',
    value: '29.364',
    unit: 'ลล.',
    subtitle: 'Final Customers',
    percent: 93,
    tone: 'var(--chart-accent)',
  },
]

const crudeSources: SourceItem[] = [
  { label: 'ตะวันออกกลาง', value: 53 },
  { label: 'อื่น ๆ', value: 27 },
  { label: 'ตะวันออกไกล', value: 11 },
  { label: 'ไทย', value: 9 },
]

const transport: TransportItem[] = [
  { icon: '🚚', label: 'ท่อ', value: 32.8 },
  { icon: '🚛', label: 'รถ', value: 44.7 },
  { icon: '🚢', label: 'เรือ', value: 22.5 },
]

const salesRows: SalesRow[] = [
  {
    icon: '⛽',
    name: 'สถานีบริการน้ำมัน',
    avg: 51.300,
    value: 24.566,
  },
  {
    icon: '👷',
    name: 'จ๊อบเบอร์',
    note: '(ผู้ค้าน้ำมันตามมาตรา 10)',
    avg: 7.389,
    value: 2.498,
  },
  {
    icon: '🏭',
    name: 'อุตสาหกรรม',
    avg: 4.000,
    value: 0.583,
  },
  {
    icon: '🚌',
    name: 'ขนส่ง',
    note: 'เช่น รถขนส่ง',
    avg: 1.120,
    value: 0.578,
  },
  {
    icon: '🏛️',
    name: 'ราชการและรัฐวิสาหกิจ',
    avg: 1.180,
    value: 0.678,
  },
  {
    icon: '🚜',
    name: 'อื่น ๆ',
    note: 'เช่น ไฟฟ้า เกษตร ประมง',
    avg: 2.990,
    value: 0.461,
  },
]

const outputCards = [
  {
    title: 'ผลิตภัณฑ์อื่นจากการกลั่น',
    value: 'เบนซิน น้ำมันเตา LPG ยางมะตอย',
    icon: 'i-lucide-package-open',
  },
  {
    title: 'เติมไบโอดีเซล',
    value: '2.189 ลล.',
    icon: 'i-lucide-droplets',
  },
  {
    title: 'จำหน่ายภาคอุตสาหกรรม',
    value: '0.024 ลล.',
    icon: 'i-lucide-factory',
  },
  {
    title: 'ส่งออก',
    value: '1.645 ลล.',
    icon: 'i-lucide-truck',
  },
]


const sideOutputs = outputCards.slice(2)

const salesTotal = computed(() =>
  salesRows.reduce((total, row) => total + row.value, 0),
)

function salesShare(value: number) {
  if (!salesTotal.value)
    return 0

  return (value / salesTotal.value) * 100
}

function salesShareWidth(value: number) {
  return `${Math.max(salesShare(value), 2)}%`
}

function formatNumber(value: number) {
  return value.toFixed(3)
}
</script>

<template>
  <div class="production-dashboard">
    <!-- Header -->
    <header class="dashboard-toolbar">
      <div class="min-w-0">
        <h2 class="page-title">
          การผลิตและจำหน่ายดีเซลหมุนเร็ว
        </h2>

        <p class="page-subtitle">
          ภาพรวมการกลั่น การผสม การขนส่ง การจำหน่าย และการส่งออก
        </p>
      </div>

      <div class="shrink-0">
        <BaseDateRangePicker />
      </div>
    </header>

    <!-- KPI -->
    <section class="kpi-grid">
      <Card
        v-for="item in kpiCards"
        :key="item.title"
        class="dashboard-card kpi-card"
      >
        <CardContent class="kpi-content">
          <div class="kpi-ring">
            <svg
              viewBox="0 0 36 36"
              class="size-full -rotate-90"
            >
              <circle
                cx="18"
                cy="18"
                r="15"
                pathLength="100"
                fill="none"
                stroke="currentColor"
                stroke-width="4"
                class="text-muted"
              />

              <circle
                cx="18"
                cy="18"
                r="15"
                pathLength="100"
                fill="none"
                :stroke="item.tone"
                stroke-width="4"
                stroke-linecap="round"
                :stroke-dasharray="`${item.percent} 100`"
              />
            </svg>

            <span>{{ item.percent }}%</span>
          </div>

          <div class="min-w-0">
            <div class="kpi-value">
              <strong>{{ item.value }}</strong>
              <span>{{ item.unit }}</span>
            </div>

            <div class="kpi-title">
              {{ item.title }}
            </div>

            <div class="kpi-subtitle">
              {{ item.subtitle }}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- Main -->
    <main class="main-grid">
      <!-- Source -->
      <Card class="dashboard-card source-card">
        <CardHeader class="panel-header">
          <CardTitle>แหล่งน้ำมันดิบ</CardTitle>
          <CardDescription>สัดส่วนตามภูมิภาค</CardDescription>
        </CardHeader>

        <CardContent class="source-content">
          <div
            v-for="item in crudeSources"
            :key="item.label"
            class="source-row"
          >
            <div class="source-label">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}%</strong>
            </div>

            <div class="progress-track">
              <div
                class="source-fill"
                :style="{ width: `${item.value}%` }"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Center column -->
      <section class="center-column">
        <Card class="dashboard-card transport-card-panel">
          <CardHeader class="panel-header">
            <CardTitle>การขนส่ง</CardTitle>
            <CardDescription>สัดส่วนรูปแบบการขนส่ง</CardDescription>
          </CardHeader>

          <CardContent class="transport-content">
            <article
              v-for="item in transport"
              :key="item.label"
              class="transport-item"
            >
              <span class="transport-emoji">
                {{ item.icon }}
              </span>

              <div class="min-w-0 flex-1">
                <div class="transport-label">
                  <strong>{{ item.label }}</strong>
                  <b>{{ item.value }}%</b>
                </div>

                <div class="progress-track transport-track">
                  <div
                    class="transport-fill"
                    :style="{ width: `${item.value}%` }"
                  />
                </div>
              </div>
            </article>
          </CardContent>
        </Card>

        <div class="side-output-stack">
          <Card
            v-for="item in sideOutputs"
            :key="item.title"
            class="dashboard-card side-output-card"
          >
            <CardContent class="side-output-content">
              <div class="side-output-icon">
                <Icon
                  :name="item.icon"
                  class="size-5"
                />
              </div>

              <div class="min-w-0">
                <div class="side-output-title">
                  {{ item.title }}
                </div>

                <div class="side-output-value">
                  {{ item.value }}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <!-- Sales -->
      <Card class="dashboard-card sales-card">
        <CardContent class="sales-content">
          <div class="sales-grid">
            <div class="sales-grid-header">
              <div>ช่องทาง</div>
              <div>เฉลี่ย ม.ค.</div>
              <div>ปริมาณ</div>
              <div>สัดส่วน</div>
            </div>

            <div
              v-for="row in salesRows"
              :key="row.name"
              class="sales-grid-row"
            >
              <div class="sale-name">
                <span class="sale-icon">
                  {{ row.icon }}
                </span>

                <div>
                  <b>{{ row.name }}</b>

                  <small v-if="row.note">
                    {{ row.note }}
                  </small>
                </div>
              </div>

              <div class="numeric-cell">
                {{ formatNumber(row.avg) }}
              </div>

              <div class="numeric-cell">
                {{ formatNumber(row.value) }}
              </div>

              <div class="share-cell">
                <div class="share-track">
                  <div
                    class="share-fill"
                    :style="{
                      width: salesShareWidth(row.value),
                    }"
                  />
                </div>

                <strong>
                  {{ salesShare(row.value).toFixed(1) }}%
                </strong>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  </div>
</template>

<style scoped>
.production-dashboard {
  --chart-primary: var(--primary);

  --chart-secondary:
    color-mix(
      in oklab,
      var(--primary) 30%,
      #9b9167
    );

  --chart-accent:
    color-mix(
      in oklab,
      var(--primary) 36%,
      var(--muted-foreground)
    );

  display: grid;
  grid-template-rows:
    auto
    clamp(128px, 18vh, 154px)
    minmax(0, 1fr);

  gap: 12px;

  width: 100%;
  height: calc(100dvh - 64px);
  min-width: 0;
  min-height: 0;

  overflow: hidden;

  color: var(--foreground);
}

/* Header */
.dashboard-toolbar {
  display: flex;
  min-height: 50px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.page-title {
  margin: 0;

  font-size: clamp(22px, 1.6vw, 30px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.page-subtitle {
  margin: 4px 0 0;

  color: var(--muted-foreground);

  font-size: clamp(12px, 0.78vw, 14px);
}

/* Common card */
.dashboard-card {
  min-width: 0;
  min-height: 0;

  gap: 0 !important;
  padding: 0 !important;

  overflow: hidden;

  border: 1px solid
    color-mix(
      in oklab,
      var(--border) 90%,
      transparent
    );

  border-radius: 12px;

  background: var(--card);
  color: var(--card-foreground);

  box-shadow:
    0 1px 2px
    color-mix(
      in oklab,
      var(--foreground) 7%,
      transparent
    );
}

/* KPI */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  min-width: 0;
  min-height: 0;
}

.kpi-card {
  height: 100%;
}

.kpi-content {
  display: flex;
  width: 100%;
  height: 100%;

  align-items: center;
  gap: clamp(15px, 1.5vw, 24px);

  padding:
    clamp(16px, 1.5vw, 24px)
    clamp(18px, 1.8vw, 30px) !important;
}

.kpi-ring {
  position: relative;

  width: clamp(58px, 4.8vw, 76px);
  height: clamp(58px, 4.8vw, 76px);

  flex: 0 0 auto;
}

.kpi-ring span {
  position: absolute;
  inset: 0;

  display: grid;
  place-items: center;

  font-size: clamp(11px, 0.8vw, 14px);
  font-weight: 800;
}

.kpi-value {
  display: flex;
  align-items: flex-end;
  gap: 7px;
}

.kpi-value strong {
  font-size: clamp(27px, 2.2vw, 40px);
  font-weight: 800;
  line-height: 1;
}

.kpi-value span {
  padding-bottom: 4px;

  color: var(--muted-foreground);

  font-size: clamp(11px, 0.75vw, 14px);
  font-weight: 700;
}

.kpi-title {
  margin-top: 6px;

  overflow: hidden;

  font-size: clamp(14px, 1vw, 18px);
  font-weight: 800;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.kpi-subtitle {
  margin-top: 2px;

  overflow: hidden;

  color: var(--muted-foreground);

  font-size: clamp(11px, 0.78vw, 14px);

  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Main layout */
.main-grid {
  display: grid;
  grid-template-columns:
    minmax(260px, 1fr)
    minmax(280px, 1fr)
    minmax(580px, 2fr);

  gap: 12px;

  min-width: 0;
  min-height: 0;
}

.source-card,
.sales-card,
.center-column {
  min-width: 0;
  min-height: 0;
}

.source-card,
.transport-card-panel,
.sales-card {
  height: 100%;
}

.center-column {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 12px;
}

.panel-header {
  flex: 0 0 auto;

  gap: 2px !important;

  padding:
    clamp(16px, 1.3vw, 22px)
    clamp(16px, 1.4vw, 24px)
    8px !important;
}

.panel-header :deep([data-slot="card-title"]) {
  font-size: clamp(18px, 1.2vw, 22px);
  font-weight: 800;
  line-height: 1.15;
}

.panel-header :deep([data-slot="card-description"]) {
  color: var(--muted-foreground);

  font-size: clamp(10px, 0.72vw, 12px);
}

/* Source */
.source-content {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 12px;

  padding:
    8px
    clamp(16px, 1.4vw, 24px)
    clamp(18px, 1.5vw, 26px) !important;
}

.source-row {
  display: grid;
  gap: 8px;
}

.source-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  font-size: clamp(13px, 0.9vw, 16px);
}

.source-label strong {
  font-size: clamp(14px, 0.95vw, 17px);
}

.progress-track,
.share-track {
  overflow: hidden;

  border-radius: 999px;

  background:
    color-mix(
      in oklab,
      var(--muted) 86%,
      var(--card)
    );
}

.progress-track {
  height: clamp(10px, 0.75vw, 14px);
}

.source-fill,
.transport-fill,
.share-fill {
  height: 100%;

  border-radius: inherit;

  background:
    linear-gradient(
      90deg,
      var(--primary),
      color-mix(
        in oklab,
        var(--primary) 68%,
        var(--chart-secondary)
      )
    );
}

/* Transport */
.transport-content {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 10px;

  padding:
    8px
    clamp(12px, 1.2vw, 18px)
    clamp(14px, 1.2vw, 20px) !important;
}

.transport-item {
  display: flex;
  align-items: center;
  gap: 13px;

  padding:
    clamp(11px, 1vw, 15px)
    clamp(12px, 1vw, 16px);

  border: 1px solid var(--border);
  border-radius: 10px;

  background:
    color-mix(
      in oklab,
      var(--muted) 42%,
      var(--card)
    );
}

.transport-emoji {
  width: 36px;
  flex: 0 0 36px;

  font-size: clamp(25px, 1.8vw, 32px);
  text-align: center;
}

.transport-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  font-size: clamp(14px, 0.95vw, 17px);
}

.transport-label b {
  font-size: clamp(15px, 1vw, 18px);
}

.transport-track {
  height: clamp(7px, 0.55vw, 10px);
  margin-top: 7px;
}

/* Small output cards under transport */
.side-output-stack {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.side-output-card {
  min-height: 62px;
}

.side-output-content {
  display: flex;
  align-items: center;
  gap: 12px;

  padding:
    clamp(10px, 0.9vw, 14px)
    clamp(12px, 1vw, 16px) !important;
}

.side-output-icon {
  display: grid;

  width: 38px;
  height: 38px;

  flex: 0 0 38px;

  place-items: center;

  border-radius: 9px;

  background:
    color-mix(
      in oklab,
      var(--primary) 11%,
      var(--card)
    );

  color: var(--primary);
}

.side-output-title {
  overflow: hidden;

  font-size: clamp(13px, 0.9vw, 16px);
  font-weight: 800;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.side-output-value {
  margin-top: 2px;

  color: var(--muted-foreground);

  font-size: clamp(11px, 0.75vw, 13px);
}

/* Sales */
.sales-content {
  width: 100%;
  height: 100%;

  padding: 0 !important;
}

.sales-grid {
  display: grid;
  grid-template-rows:
    clamp(42px, 5.8vh, 58px)
    repeat(6, minmax(0, 1fr));

  width: 100%;
  height: 100%;
  min-height: 0;

  overflow: hidden;

  background: var(--card);
}

.sales-grid-header,
.sales-grid-row {
  display: grid;
  grid-template-columns:
    minmax(0, 42%)
    minmax(0, 18%)
    minmax(0, 16%)
    minmax(0, 24%);

  min-width: 0;
  min-height: 0;
}

.sales-grid-header {
  background: var(--primary);
  color: var(--primary-foreground);

  font-size: clamp(10px, 0.75vw, 13px);
  font-weight: 800;
}

.sales-grid-header > div,
.sales-grid-row > div {
  display: flex;
  min-width: 0;
  min-height: 0;

  align-items: center;

  padding:
    clamp(7px, 0.7vw, 11px)
    clamp(8px, 0.75vw, 12px);

  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.sales-grid-header > div {
  justify-content: center;

  border-right-color:
    color-mix(
      in oklab,
      var(--primary-foreground) 32%,
      transparent
    );
}

.sales-grid-header > div:last-child,
.sales-grid-row > div:last-child {
  border-right: 0;
}

.sales-grid-row:last-child > div {
  border-bottom: 0;
}

.sales-grid-row:nth-child(even) > div {
  background:
    color-mix(
      in oklab,
      var(--muted) 48%,
      var(--card)
    );
}

.sales-grid-row:nth-child(odd) > div {
  background: var(--card);
}

.sale-name {
  display: grid !important;
  grid-template-columns:
    clamp(28px, 2.2vw, 38px)
    minmax(0, 1fr);

  align-items: center;
  gap: clamp(7px, 0.75vw, 11px);
}

.sale-icon {
  font-size: clamp(22px, 1.7vw, 30px);
  text-align: center;
}

.sale-name b,
.sale-name small {
  display: block;
}

.sale-name b {
  overflow: hidden;

  font-size: clamp(11px, 0.82vw, 14px);
  line-height: 1.12;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.sale-name small {
  margin-top: 2px;

  overflow: hidden;

  color: var(--muted-foreground);

  font-size: clamp(8px, 0.58vw, 10px);
  line-height: 1.1;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.numeric-cell {
  justify-content: flex-end;

  font-size: clamp(11px, 0.82vw, 14px);
  font-weight: 800;

  white-space: nowrap;
}

.share-cell {
  display: grid !important;
  grid-template-columns: minmax(60px, 1fr) auto;
  align-items: center;
  gap: 8px;
}

.share-track {
  width: 100%;
  height: clamp(7px, 0.55vw, 10px);
}

.share-cell strong {
  min-width: 38px;

  font-size: clamp(9px, 0.68vw, 12px);
  text-align: right;
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 1280px) {
  .production-dashboard {
    height: auto;
    min-height: calc(100dvh - 64px);

    overflow: visible;
  }

  .main-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sales-card {
    grid-column: 1 / -1;
    min-height: 500px;
  }

  .center-column {
    min-height: 500px;
  }
}

@media (max-width: 900px) {
  .kpi-grid,
  .main-grid {
    grid-template-columns: 1fr;
  }

  .sales-card {
    grid-column: auto;
  }
}

@media (max-width: 640px) {
  .production-dashboard {
    height: auto;
  }

  .dashboard-toolbar {
    align-items: flex-start;
  }

  .sales-card {
    overflow-x: auto;
  }

  .sales-grid {
    min-width: 680px;
  }
}
</style>
