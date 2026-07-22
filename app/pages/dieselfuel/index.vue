<script setup lang="ts">
import { computed } from 'vue'

type SeriesItem = {
  name: string
  average: number | null
  current: number | null
}

type SalesItem = {
  name: string
  average: number | null
  current: number | null
}

type KpiItem = {
  title: string
  value: number
  average: number | null
  unit: string
  description: string
  icon: string
}

type SellerRow = {
  rank: number
  name: string
  generalAverage: number | null
  generalCurrent: number | null
  jobberAverage: number | null
  jobberCurrent: number | null
  totalCurrent: number
}

const refineryData: SeriesItem[] = [
  { name: 'BCP', average: 9.930, current: 8.753 },
  { name: 'BSRC', average: 11.533, current: 10.096 },
  { name: 'IRPC', average: 7.658, current: 13.551 },
  { name: 'GC', average: 16.227, current: 15.020 },
  { name: 'SPRC', average: 10.914, current: 7.428 },
  { name: 'TOP', average: 18.940, current: 17.873 },
]

const producerData: SeriesItem[] = [
  { name: 'BCP', average: 10.340, current: 4.985 },
  { name: 'BSRC', average: 8.237, current: 4.258 },
  { name: 'IRPC', average: 5.670, current: 3.138 },
  { name: 'OR', average: 18.009, current: 11.014 },
  { name: 'GC', average: 2.944, current: 1.200 },
  { name: 'SHELL', average: 3.148, current: 1.444 },
  { name: 'SINOPEC', average: 0.193, current: 0.127 },
  { name: 'SPRC', average: 1.547, current: 0.323 },
  { name: 'SFL', average: 3.736, current: 1.165 },
  { name: 'SUSCO', average: 0.044, current: null },
  { name: 'TOP', average: 12.497, current: 3.777 },
  { name: 'PC SIAM', average: null, current: null },
]

const generalSales: SalesItem[] = [
  { name: 'BCP', average: null, current: 4.717 },
  { name: 'BSRC', average: null, current: 4.201 },
  { name: 'TOP', average: null, current: 1.962 },
  { name: 'IRPC', average: null, current: 0.565 },
  { name: 'PTTGC', average: null, current: 0.273 },
  { name: 'SFL', average: null, current: 1.357 },
  { name: 'OR', average: null, current: 9.577 },
  { name: 'SHELL', average: null, current: 2.009 },
  { name: 'SINOPEC SUSCO', average: null, current: 0.014 },
  { name: 'SUSCO', average: null, current: 0.146 },
  { name: 'PTT', average: null, current: 0.680 },
  { name: 'PTG', average: null, current: 0.239 },
  { name: 'UNIQUE GAS', average: null, current: 0.076 },
  { name: 'PTTRM', average: null, current: 1.040 },
  { name: 'IRPC OIL', average: null, current: 0.010 },
  { name: 'PC SIAM', average: null, current: null },
]

const jobberSales: SalesItem[] = [
  { name: 'BCP', average: null, current: 0.246 },
  { name: 'BSRC', average: null, current: null },
  { name: 'TOP', average: null, current: 0.390 },
  { name: 'IRPC', average: null, current: 1.462 },
  { name: 'PTTGC', average: null, current: null },
  { name: 'SFL', average: null, current: 0.193 },
  { name: 'OR', average: null, current: 0.179 },
  { name: 'SHELL', average: null, current: 0.028 },
  { name: 'SINOPEC SUSCO', average: null, current: null },
  { name: 'SUSCO', average: null, current: null },
  { name: 'PTT', average: null, current: null },
  { name: 'PTG', average: null, current: null },
  { name: 'UNIQUE GAS', average: null, current: null },
  { name: 'PTTRM', average: null, current: null },
  { name: 'IRPC OIL', average: null, current: null },
  { name: 'PC SIAM', average: null, current: null },
]

const kpis: KpiItem[] = [
  {
    title: 'โรงกลั่นผลิตดีเซลพื้นฐาน',
    value: 72.721,
    average: 75.202,
    unit: 'ล้านลิตร',
    description: '',
    icon: 'i-lucide-factory',
  },
  {
    title: 'ผู้ผลิตดีเซลหมุนเร็วธรรมดา (ถังผสม)',
    value: 31.432,
    average: 66.365,
    unit: 'ล้านลิตร',
    description: '',
    icon: 'i-lucide-flask-conical',
  },
  {
    title: 'ผู้ค้าจำหน่ายลูกค้าทั่วไป',
    value: 26.866,
    average: null,
    unit: 'ล้านลิตร',
    description: '',
    icon: 'i-lucide-building-2',
  },
  {
    title: 'ผู้ค้าจำหน่าย ม.10 Jobber',
    value: 2.498,
    average: null,
    unit: 'ล้านลิตร',
    description: '',
    icon: 'i-lucide-briefcase-business',
  },
  {
    title: 'รวมจำหน่าย (ลูกค้าทั่วไป + ม.10)',
    value: 29.364,
    average: null,
    unit: 'ล้านลิตร',
    description: '',
    icon: 'i-lucide-chart-no-axes-combined',
  },
]

function seriesMax(items: SeriesItem[]) {
  const values = items.flatMap(item => [item.average, item.current])
    .filter((value): value is number => value !== null)

  return values.length > 0 ? Math.max(...values) : 0
}

const refineryMax = computed(() => seriesMax(refineryData))
const producerMax = computed(() => seriesMax(producerData))

const generalSalesTotal = computed(() =>
  generalSales.reduce((sum, item) => sum + (item.current ?? 0), 0),
)

const jobberSalesTotal = computed(() =>
  jobberSales.reduce((sum, item) => sum + (item.current ?? 0), 0),
)

const grandSalesTotal = computed(() =>
  generalSalesTotal.value + jobberSalesTotal.value,
)

const salesShare = computed(() => ({
  general:
    grandSalesTotal.value > 0
      ? (generalSalesTotal.value / grandSalesTotal.value) * 100
      : 0,
  jobber:
    grandSalesTotal.value > 0
      ? (jobberSalesTotal.value / grandSalesTotal.value) * 100
      : 0,
}))

const salesDonut = computed(() =>
  `conic-gradient(
    var(--primary) 0 ${salesShare.value.general}%,
    color-mix(in oklab, var(--primary) 45%, var(--muted))
      ${salesShare.value.general}% 100%
  )`,
)

const sellerRows = computed<SellerRow[]>(() => {
  const companyNames = new Set([
    ...generalSales.map(item => item.name),
    ...jobberSales.map(item => item.name),
  ])

  return [...companyNames]
    .map((name) => {
      const general = generalSales.find(item => item.name === name)
      const jobber = jobberSales.find(item => item.name === name)
      const generalCurrent = general?.current ?? null
      const jobberCurrent = jobber?.current ?? null

      return {
        name,
        generalAverage: general?.average ?? null,
        generalCurrent,
        jobberAverage: jobber?.average ?? null,
        jobberCurrent,
        totalCurrent: (generalCurrent ?? 0) + (jobberCurrent ?? 0),
      }
    })
    .sort((a, b) => b.totalCurrent - a.totalCurrent)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }))
})

function formatNumber(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
}

function formatNullableNumber(value: number | null) {
  return value === null ? '-' : formatNumber(value)
}

function verticalBarHeight(value: number | null, max: number) {
  if (value === null || value <= 0 || max <= 0)
    return '0%'

  return `${Math.max((value / max) * 100, 1.5)}%`
}
</script>

<template>
  <div class="diesel-chart-dashboard w-full min-w-0 space-y-3">
    <!-- Header -->
    <header class="flex flex-wrap items-center justify-between gap-2">
      <div class="min-w-0">
        <h2 class="text-2xl font-bold tracking-tight">
          โครงสร้างการผลิตและจำหน่ายดีเซลหมุนเร็ว
        </h2>

        <p class="text-sm text-muted-foreground">
          ข้อมูล ณ วันที่ 19 เมษายน 2569 · หน่วย: ล้านลิตร
        </p>
      </div>

      <div class="shrink-0">
        <BaseDateRangePicker />
      </div>
    </header>

    <!-- KPI -->
    <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      <Card
        v-for="item in kpis"
        :key="item.title"
        class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm"
      >
        <CardContent class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm font-medium text-muted-foreground">
                {{ item.title }}
              </p>

              <div class="mt-1 flex flex-wrap items-baseline gap-x-2">
                <span class="text-2xl font-bold tracking-tight tabular-nums">
                  {{ formatNumber(item.value) }}
                </span>

                <span class="text-xs text-muted-foreground">
                  {{ item.unit }}
                </span>
              </div>

              <p class="mt-2 text-xs text-muted-foreground">
                เฉลี่ย ม.ค. {{ formatNullableNumber(item.average) }}
                {{ item.description }}
              </p>
            </div>

            <div
              class="
                flex size-12 shrink-0 items-center justify-center rounded-2xl
                bg-primary/10 text-primary
              "
            >
              <Icon :name="item.icon" size="27" />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- Vertical comparison charts -->
    <section
      class="
        grid min-w-0 gap-3
        xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]
      "
    >
      <!-- Refinery -->
      <Card class="min-w-0 gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
        <CardHeader class="px-4 pb-3 pt-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle class="text-lg">
                โรงกลั่นผลิตดีเซลพื้นฐาน
              </CardTitle>

              <CardDescription>
                เปรียบเทียบสถิติเฉลี่ยเดือนมกราคมกับปริมาณกลั่นหรือผลิตวันที่ 19 เม.ย.
              </CardDescription>
            </div>

            <div class="chart-legend">
              <span>
                <i class="legend-dot legend-average" />
                เฉลี่ย ม.ค.
              </span>

              <span>
                <i class="legend-dot legend-current" />
                19 เม.ย.
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent class="px-4 pb-4 pt-0">
          <div class="vertical-chart-scroll">
            <div class="vertical-chart refinery-vertical-chart">
              <div
                v-for="item in refineryData"
                :key="item.name"
                class="vertical-group"
              >
                <div class="vertical-values">
                  <span>{{ formatNullableNumber(item.average) }}</span>
                  <strong>{{ formatNullableNumber(item.current) }}</strong>
                </div>

                <div class="vertical-bars">
                  <div class="vertical-track">
                    <div
                      class="vertical-bar vertical-bar-average"
                      :style="{
                        height: verticalBarHeight(item.average, refineryMax),
                      }"
                      :title="`เฉลี่ย ม.ค. ${formatNullableNumber(item.average)}`"
                    />
                  </div>

                  <div class="vertical-track">
                    <div
                      class="vertical-bar vertical-bar-current"
                      :style="{
                        height: verticalBarHeight(item.current, refineryMax),
                      }"
                      :title="`19 เม.ย. ${formatNullableNumber(item.current)}`"
                    />
                  </div>
                </div>

                <div class="vertical-label">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Producer -->
      <Card class="min-w-0 gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
        <CardHeader class="px-4 pb-3 pt-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle class="text-lg">
                ผู้ผลิตดีเซลหมุนเร็วธรรมดา
              </CardTitle>

              <CardDescription>
                ถังผสม · BCP จำหน่ายภาคอุตสาหกรรม · UNIQUE GAS จำหน่ายสถานีบริการ
              </CardDescription>
            </div>

            <div class="chart-legend">
              <span>
                <i class="legend-dot legend-average" />
                เฉลี่ย ม.ค.
              </span>

              <span>
                <i class="legend-dot legend-current" />
                ผสมเสร็จ
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent class="px-4 pb-4 pt-0">
          <div class="vertical-chart-scroll">
            <div class="vertical-chart producer-vertical-chart">
              <div
                v-for="item in producerData"
                :key="item.name"
                class="vertical-group"
              >
                <div class="vertical-values">
                  <span>{{ formatNullableNumber(item.average) }}</span>
                  <strong>{{ formatNullableNumber(item.current) }}</strong>
                </div>

                <div class="vertical-bars">
                  <div class="vertical-track">
                    <div
                      class="vertical-bar vertical-bar-average"
                      :style="{
                        height: verticalBarHeight(item.average, producerMax),
                      }"
                      :title="`เฉลี่ย ม.ค. ${formatNullableNumber(item.average)}`"
                    />
                  </div>

                  <div class="vertical-track">
                    <div
                      class="vertical-bar vertical-bar-current"
                      :style="{
                        height: verticalBarHeight(item.current, producerMax),
                      }"
                      :title="`ผสมเสร็จ ${formatNullableNumber(item.current)}`"
                    />
                  </div>
                </div>

                <div class="vertical-label">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- Sales -->
    <section
      class="
        grid min-w-0 gap-3
        xl:grid-cols-[minmax(300px,0.65fr)_minmax(0,1.35fr)]
      "
    >
      <!-- Sales summary -->
      <Card class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
        <CardHeader class="px-4 pb-3 pt-4">
          <CardTitle class="text-lg">
            สัดส่วนการจำหน่าย
          </CardTitle>

          <CardDescription>
            ลูกค้าทั่วไปและจำหน่าย ม.10 Jobber
          </CardDescription>
        </CardHeader>

        <CardContent class="px-4 pb-4 pt-0">
          <div class="sales-summary">
            <div
              class="sales-donut"
              :style="{ background: salesDonut }"
            >
              <div class="sales-donut-hole">
                <span class="text-sm text-muted-foreground">
                  รวมจำหน่าย
                </span>

                <strong class="text-3xl tabular-nums">
                  {{ formatNumber(grandSalesTotal) }}
                </strong>

                <span class="text-sm text-muted-foreground">
                  ล้านลิตร
                </span>
              </div>
            </div>

            <div class="sales-share-grid">
              <div class="sales-share-card">
                <div class="sales-share-icon bg-primary text-primary-foreground">
                  <Icon name="i-lucide-building-2" size="22" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium">
                    ลูกค้าทั่วไป
                  </p>

                  <p class="text-xl font-bold tabular-nums text-primary">
                    {{ formatNumber(generalSalesTotal) }}
                  </p>
                </div>

                <strong class="text-base tabular-nums">
                  {{ salesShare.general.toFixed(1) }}%
                </strong>
              </div>

              <div class="sales-share-card">
                <div class="sales-share-icon bg-muted text-foreground">
                  <Icon name="i-lucide-briefcase-business" size="22" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium">
                    ม.10 Jobber
                  </p>

                  <p class="text-xl font-bold tabular-nums">
                    {{ formatNumber(jobberSalesTotal) }}
                  </p>
                </div>

                <strong class="text-base tabular-nums">
                  {{ salesShare.jobber.toFixed(1) }}%
                </strong>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Seller table -->
      <Card class="min-w-0 gap-0 overflow-hidden rounded-2xl border-border/80 py-0 shadow-sm">
        <CardHeader class="px-4 pb-3 pt-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle class="text-lg">
                ผู้ค้าจำหน่ายดีเซลหมุนเร็ว
              </CardTitle>

              <CardDescription>
                ลูกค้าทั่วไปและจำหน่าย ม.10 Jobber
              </CardDescription>
            </div>

            <Badge variant="secondary">
              {{ sellerRows.length }} บริษัท
            </Badge>
          </div>
        </CardHeader>

        <CardContent class="p-0">
          <div class="seller-table-scroll">
            <table class="seller-table">
              <thead>
                <tr>
                  <th rowspan="2" class="seller-rank-column">
                    อันดับ
                  </th>
                  <th rowspan="2" class="seller-name-column">
                    บริษัท
                  </th>
                  <th colspan="2" class="seller-group-header seller-group-general">
                    ลูกค้าทั่วไป
                  </th>
                  <th colspan="2" class="seller-group-header seller-group-jobber">
                    ม.10 Jobber
                  </th>
                </tr>
                <tr>
                  <th>สถิติเฉลี่ย ม.ค.</th>
                  <th>การจำหน่าย 19 เม.ย.</th>
                  <th>สถิติเฉลี่ย ม.ค.</th>
                  <th>จำหน่าย ม.10 19 เม.ย.</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="row in sellerRows"
                  :key="row.name"
                >
                  <td class="seller-rank-value tabular-nums">
                    {{ row.rank }}
                  </td>

                  <td class="seller-company-name">
                    {{ row.name }}
                  </td>

                  <td class="seller-number-cell tabular-nums">
                    {{ formatNullableNumber(row.generalAverage) }}
                  </td>

                  <td class="seller-number-cell seller-current-value tabular-nums">
                    {{ formatNullableNumber(row.generalCurrent) }}
                  </td>

                  <td class="seller-number-cell tabular-nums">
                    {{ formatNullableNumber(row.jobberAverage) }}
                  </td>

                  <td class="seller-number-cell seller-current-value tabular-nums">
                    {{ formatNullableNumber(row.jobberCurrent) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>

<style scoped>
.diesel-chart-dashboard :deep([data-slot='card-header']) {
  gap: 0.25rem;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem 1rem;
  color: var(--muted-foreground);
  font-size: 0.72rem;
}

.chart-legend span {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.legend-dot {
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 9999px;
}

.legend-average {
  background:
    color-mix(
      in oklab,
      var(--muted-foreground) 65%,
      var(--card)
    );
}

.legend-current {
  background: var(--primary);
}

/* Vertical charts */
.vertical-chart-scroll {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.vertical-chart {
  display: grid;
  min-height: 270px;
  align-items: end;
  gap: 0.9rem;
  padding: 0.5rem 0.25rem 0;
  background:
    repeating-linear-gradient(
      to top,
      color-mix(in oklab, var(--border) 70%, transparent) 0,
      color-mix(in oklab, var(--border) 70%, transparent) 1px,
      transparent 1px,
      transparent 48px
    );
}

.refinery-vertical-chart {
  min-width: 520px;
  grid-template-columns: repeat(6, minmax(68px, 1fr));
}

.producer-vertical-chart {
  min-width: 980px;
  grid-template-columns: repeat(12, minmax(72px, 1fr));
}

.vertical-group {
  display: grid;
  min-width: 0;
  grid-template-rows: 32px 190px 34px;
  gap: 0.35rem;
  align-items: end;
}

.vertical-values {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.3rem;
  text-align: center;
  font-size: 0.66rem;
}

.vertical-values span {
  color: var(--muted-foreground);
}

.vertical-values strong {
  color: var(--foreground);
}

.vertical-bars {
  display: flex;
  height: 190px;
  align-items: flex-end;
  justify-content: center;
  gap: 0.35rem;
}

.vertical-track {
  display: flex;
  width: min(30px, 42%);
  height: 100%;
  align-items: flex-end;
  overflow: hidden;
  border-radius: 0.45rem 0.45rem 0 0;
  background:
    color-mix(
      in oklab,
      var(--muted) 70%,
      var(--card)
    );
}

.vertical-bar {
  width: 100%;
  min-height: 0;
  border-radius: 0.4rem 0.4rem 0 0;
  transition: height 0.2s ease;
}

.vertical-bar-average {
  background:
    color-mix(
      in oklab,
      var(--muted-foreground) 58%,
      var(--card)
    );
}

.vertical-bar-current {
  background: var(--primary);
}

.vertical-label {
  overflow: hidden;
  color: var(--foreground);
  text-align: center;
  font-size: 0.72rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Donut */
.sales-summary {
  display: flex;
  min-width: 0;
  align-items: stretch;
  flex-direction: column;
  gap: 1.25rem;
}

.sales-donut {
  position: relative;
  width: min(100%, 280px);
  aspect-ratio: 1;
  margin: 0 auto;
  border-radius: 9999px;
}

.sales-donut-hole {
  position: absolute;
  inset: 26%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: inherit;
  background: var(--card);
  text-align: center;
}

.sales-share-grid {
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.sales-share-card {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem;
  border: 1px solid var(--border);
  border-radius: 0.9rem;
}

.sales-share-icon {
  display: flex;
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
}

/* Seller table */
.seller-table-scroll {
  width: 100%;
  max-height: 322px;
  overflow: auto;
  scrollbar-gutter: stable;
}

.seller-table {
  width: 100%;
  min-width: 880px;
  border-collapse: separate;
  border-spacing: 0;
  color: var(--foreground);
  font-size: 0.8rem;
}

.seller-table th,
.seller-table td {
  height: 46px;
  padding: 0.6rem 0.75rem;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  text-align: center;
  vertical-align: middle;
}

.seller-table th:last-child,
.seller-table td:last-child {
  border-right: 0;
}

.seller-table thead th {
  position: sticky;
  z-index: 3;
  background:
    color-mix(
      in oklab,
      var(--muted) 42%,
      var(--card)
    );
  color: var(--foreground);
  font-weight: 600;
  line-height: 1.25;
  white-space: normal;
}

.seller-table thead tr:first-child th {
  top: 0;
}

.seller-table thead tr:nth-child(2) th {
  top: 42px;
}

.seller-table thead tr:first-child th {
  height: 42px;
  font-size: 0.88rem;
}

.seller-table tbody tr:last-child td {
  border-bottom: 0;
}

.seller-table tbody tr:hover td {
  background:
    color-mix(
      in oklab,
      var(--muted) 35%,
      transparent
    );
}

.seller-rank-column {
  width: 76px;
}

.seller-name-column {
  width: 120px;
}

.seller-group-header {
  letter-spacing: 0.01em;
}

.seller-group-general {
  background:
    color-mix(
      in oklab,
      var(--primary) 10%,
      var(--card)
    ) !important;
}

.seller-group-jobber {
  background:
    color-mix(
      in oklab,
      var(--primary) 6%,
      var(--muted)
    ) !important;
}

.seller-rank-value {
  color: var(--muted-foreground);
  font-weight: 600;
}

.seller-company-name {
  text-align: left !important;
  font-weight: 600;
  white-space: nowrap;
}

.seller-number-cell {
  min-width: 150px;
  color: var(--muted-foreground);
}

.seller-current-value {
  color: var(--foreground);
  font-weight: 700;
}

@media (max-width: 768px) {
  .vertical-chart {
    min-height: 245px;
  }

  .vertical-group {
    grid-template-rows: 30px 165px 32px;
  }

  .vertical-bars {
    height: 165px;
  }

  .sales-share-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .sales-donut {
    width: min(100%, 240px);
  }
}
</style>
