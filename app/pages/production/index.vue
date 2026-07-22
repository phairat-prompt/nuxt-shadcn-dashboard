<script setup lang="ts">
import { computed } from 'vue'

type MetricCard = {
  title: string
  subtitle: string
  value: number
  unit: string
  icon: string
  comparison?: string
}


type SourceItem = {
  label: string
  description?: string
  value: number
}

type TransportItem = {
  label: string
  value: number
  icon: string
  color: string
}

type SalesRow = {
  name: string
  note?: string
  average: number
  value: number
  icon: string
}

const metrics: MetricCard[] = [
  {
    title: 'น้ำมันดิบเข้ากลั่น',
    subtitle: 'ปริมาณน้ำมันดิบที่เข้าสู่กระบวนการกลั่น',
    value: 176.806,
    unit: 'ล้านลิตร',
    icon: 'i-lucide-droplets',
  },
  {
    title: 'ผลิตดีเซลพื้นฐาน',
    subtitle: 'ผลผลิตจากโรงกลั่น',
    value: 72.721,
    unit: 'ล้านลิตร',
    icon: 'i-lucide-factory',
    comparison: 'เฉลี่ย มี.ค. 78.763 ล้านลิตร',
  },
  {
    title: 'ผลิตดีเซลหมุนเร็ว',
    subtitle: 'โรงกลั่นและผู้ค้าน้ำมันตามมาตรา 7',
    value: 31.432,
    unit: 'ล้านลิตร',
    icon: 'i-lucide-warehouse',
    comparison: 'เติมไบโอดีเซล 2.189 ล้านลิตร',
  },
  {
    title: 'จำหน่ายลูกค้าปลายทาง',
    subtitle: 'ปริมาณจำหน่ายดีเซลหมุนเร็ว',
    value: 29.364,
    unit: 'ล้านลิตร',
    icon: 'i-lucide-fuel',
    comparison: 'เฉลี่ย ม.ค.–ก.พ. 69.862 ล้านลิตร',
  },
]


const crudeSources: SourceItem[] = [
  {
    label: 'ตะวันออกกลาง',
    value: 53,
  },
  {
    label: 'อื่น ๆ',
    description: 'สหรัฐฯ แอฟริกาตะวันตก และออสเตรเลีย',
    value: 27,
  },
  {
    label: 'ตะวันออกไกล',
    value: 11,
  },
  {
    label: 'ประเทศไทย',
    value: 9,
  },
]

const transportItems: TransportItem[] = [
  {
    label: 'รถ',
    value: 44.7,
    icon: 'i-lucide-truck',
    color: 'var(--chart-1)',
  },
  {
    label: 'ท่อ',
    value: 32.8,
    icon: 'i-lucide-route',
    color: 'var(--chart-2)',
  },
  {
    label: 'เรือ',
    value: 22.5,
    icon: 'i-lucide-ship',
    color: 'var(--chart-3)',
  },
]

const salesRows: SalesRow[] = [
  {
    icon: 'i-lucide-fuel',
    name: 'สถานีบริการน้ำมัน',
    average: 51.300,
    value: 24.566,
  },
  {
    icon: 'i-lucide-briefcase-business',
    name: 'จ๊อบเบอร์',
    note: 'ผู้ค้าน้ำมันตามมาตรา 10',
    average: 7.389,
    value: 2.498,
  },
  {
    icon: 'i-lucide-factory',
    name: 'อุตสาหกรรม',
    average: 4.000,
    value: 0.583,
  },
  {
    icon: 'i-lucide-bus-front',
    name: 'ขนส่ง',
    note: 'เช่น รถขนส่ง',
    average: 1.120,
    value: 0.578,
  },
  {
    icon: 'i-lucide-landmark',
    name: 'ราชการและรัฐวิสาหกิจ',
    average: 1.180,
    value: 0.678,
  },
  {
    icon: 'i-lucide-tractor',
    name: 'อื่น ๆ',
    note: 'ไฟฟ้า เกษตร และประมง',
    average: 2.990,
    value: 0.461,
  },
]

const totalSales = computed(() => (
  salesRows.reduce((total, row) => total + row.value, 0)
))

const transportGradient = computed(() => {
  let start = 0

  const segments = transportItems.map((item) => {
    const end = start + item.value
    const segment = `${item.color} ${start}% ${end}%`
    start = end
    return segment
  })

  return `conic-gradient(${segments.join(', ')})`
})

function formatNumber(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
}
</script>

<template>
  <div class="production-dashboard w-full min-w-0 space-y-3">
    <!-- Header -->
    <header class="flex flex-wrap items-center justify-between gap-2">
      <div class="min-w-0">
        <h2 class="text-2xl font-bold tracking-tight">
          การผลิตและจำหน่ายน้ำมันกลุ่มดีเซล
        </h2>

        <!-- <p class="text-sm text-muted-foreground">
          ติดตามการจัดหา การผลิต การกระจาย และการจำหน่ายน้ำมัน · หน่วย: ล้านลิตร
        </p> -->
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <BaseDateRangePicker />
      </div>
    </header>

    <!-- KPI cards -->
    <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        v-for="metric in metrics"
        :key="metric.title"
        class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm"
      >
        <CardContent class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm font-medium text-muted-foreground">
                {{ metric.title }}
              </p>

              <div class="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span class="text-2xl font-bold tracking-tight tabular-nums">
                  {{ formatNumber(metric.value) }}
                </span>

                <span class="text-xs font-medium text-muted-foreground">
                  {{ metric.unit }}
                </span>
              </div>
            </div>

            <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon :name="metric.icon" size="30" />
            </div>
          </div>

          <p class="mt-2 text-xs text-muted-foreground">
            {{ metric.comparison || metric.subtitle }}
          </p>
        </CardContent>
      </Card>
    </section>

    <!-- Main dashboard -->
    <section
      class="
        grid min-w-0 gap-3
        xl:grid-cols-[minmax(340px,0.75fr)_minmax(0,1.65fr)]
      "
    >
      <!-- Left column -->
      <div class="min-w-0 space-y-3">
        <!-- Sources -->
        <Card class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
          <CardHeader class="px-4 pb-2 pt-4">
            <CardTitle class="text-lg">
              แหล่งน้ำมันดิบ
            </CardTitle>

            <CardDescription>
              สัดส่วนแหล่งผลิตน้ำมันดิบที่นำเข้ากลั่น
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4 px-4 pb-4 pt-1">
            <div
              v-for="source in crudeSources"
              :key="source.label"
              class="space-y-1.5"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-sm font-medium">
                    {{ source.label }}
                  </p>

                  <p
                    v-if="source.description"
                    class="text-xs text-muted-foreground"
                  >
                    {{ source.description }}
                  </p>
                </div>

                <span class="text-sm font-semibold tabular-nums">
                  {{ source.value }}%
                </span>
              </div>

              <div class="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  class="h-full rounded-full bg-primary transition-all"
                  :style="{ width: `${source.value}%` }"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Transport donut -->
        <Card class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
          <CardHeader class="px-4 pb-2 pt-4">
            <CardTitle class="text-lg">
              สัดส่วนการขนส่ง
            </CardTitle>

            <CardDescription>
              ช่องทางการขนส่งน้ำมันไปยังคลังและลูกค้า
            </CardDescription>
          </CardHeader>

          <CardContent class="px-4 pb-4 pt-1">
            <div class="transport-layout">
              <div
                class="transport-donut"
                :style="{ background: transportGradient }"
              >
                <div class="transport-donut-hole">
                  <span class="text-xs text-muted-foreground">รวม</span>
                  <strong class="text-xl">100%</strong>
                </div>
              </div>

              <div class="w-full space-y-3">
                <div
                  v-for="item in transportItems"
                  :key="item.label"
                  class="flex items-center gap-2.5 rounded-xl border p-2.5"
                >
                  <div
                    class="
                      flex size-9 shrink-0 items-center justify-center
                      rounded-lg
                    "
                    :style="{
                      backgroundColor:
                        `color-mix(in oklab, ${item.color} 12%, transparent)`,
                      color: item.color,
                    }"
                  >
                    <Icon :name="item.icon" class="size-4" />
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium">
                      {{ item.label }}
                    </p>

                    <p class="text-xs text-muted-foreground">
                      ช่องทางขนส่ง
                    </p>
                  </div>

                  <strong class="tabular-nums">
                    {{ item.value.toFixed(1) }}%
                  </strong>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Sales table -->
      <Card class="min-w-0 gap-0 overflow-hidden rounded-2xl border-border/80 py-0 shadow-sm">
        <CardHeader class="px-4 pb-3 pt-4">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle class="text-lg">
                ปริมาณจำหน่ายตามปลายทาง
              </CardTitle>

              <CardDescription>
                เปรียบเทียบค่าเฉลี่ยเดือนมกราคมกับปริมาณปัจจุบัน
              </CardDescription>
            </div>

            <div class="text-right">
              <p class="text-xs text-muted-foreground">
                รวมปริมาณ
              </p>

              <p class="text-xl font-bold tabular-nums text-primary">
                {{ formatNumber(totalSales) }}
                <span class="text-xs font-medium text-muted-foreground">
                  ลล.
                </span>
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent class="p-0">
          <div class="overflow-x-auto">
            <table class="sales-table">
              <thead>
                <tr>
                  <th>ประเภทการจำหน่าย</th>
                  <th>เฉลี่ย ม.ค.</th>
                  <th>ปริมาณ</th>
                  <th>สัดส่วน</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="row in salesRows"
                  :key="row.name"
                >
                  <td>
                    <div class="flex items-center gap-3">
                      <div
                        class="
                          flex size-9 shrink-0 items-center justify-center
                          rounded-lg bg-muted text-muted-foreground
                        "
                      >
                        <Icon :name="row.icon" class="size-4" />
                      </div>

                      <div class="min-w-0">
                        <p class="font-medium text-foreground">
                          {{ row.name }}
                        </p>

                        <p
                          v-if="row.note"
                          class="text-xs text-muted-foreground"
                        >
                          {{ row.note }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td class="tabular-nums">
                    {{ formatNumber(row.average) }}
                  </td>

                  <td class="font-semibold tabular-nums text-foreground">
                    {{ formatNumber(row.value) }}
                  </td>

                  <td>
                    <div class="flex min-w-[130px] items-center gap-2">
                      <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          class="h-full rounded-full bg-primary"
                          :style="{
                            width: `${Math.max((row.value / totalSales) * 100, 2)}%`,
                          }"
                        />
                      </div>

                      <span
                        class="
                          w-12 text-right text-xs font-medium tabular-nums
                          text-muted-foreground
                        "
                      >
                        {{ ((row.value / totalSales) * 100).toFixed(1) }}%
                      </span>
                    </div>
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
.production-dashboard {
  --chart-1: var(--primary);
  --chart-2: color-mix(in oklab, var(--primary) 55%, #10b981);
  --chart-3: color-mix(in oklab, var(--primary) 45%, #f97316);
  --chart-4: color-mix(in oklab, var(--primary) 50%, #8b5cf6);
}



.production-dashboard :deep([data-slot='card-header']) {
  gap: 0.2rem;
}

.production-dashboard :deep([data-slot='card-description']) {
  line-height: 1.3;
}

.production-dashboard :deep([data-slot='card-title']) {
  line-height: 1.25;
}

.transport-layout {
  display: grid;
  grid-template-columns: minmax(150px, 0.9fr) minmax(170px, 1fr);
  align-items: center;
  gap: 1rem;
}

.transport-donut {
  position: relative;
  width: min(100%, 180px);
  aspect-ratio: 1;
  margin: 0 auto;
  border-radius: 9999px;
}

.transport-donut::after {
  position: absolute;
  inset: 0;
  border: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
  border-radius: inherit;
  content: '';
}

.transport-donut-hole {
  position: absolute;
  inset: 25%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 9999px;
  background: var(--card);
}

.sales-table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  color: var(--foreground);
  font-size: 0.875rem;
}

.sales-table th,
.sales-table td {
  padding: 0.6rem 1rem;
  border-top: 1px solid var(--border);
  text-align: left;
  vertical-align: middle;
}

.sales-table th {
  background: color-mix(in oklab, var(--muted) 45%, var(--card));
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.sales-table th:nth-child(n + 2),
.sales-table td:nth-child(n + 2) {
  text-align: right;
}

.sales-table tbody tr {
  transition: background-color 0.15s ease;
}

.sales-table tbody tr:hover {
  background: color-mix(in oklab, var(--muted) 45%, transparent);
}


@media (max-width: 900px) {
  .transport-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .sales-table th,
  .sales-table td {
    padding-right: 0.875rem;
    padding-left: 0.875rem;
  }
}
</style>
