<script setup lang="ts">
import { computed } from 'vue'

type KpiItem = {
  title: string
  value: number
  unit: string
  description: string
  icon: string
  secondary?: string
}

type SourceItem = {
  label: string
  value: number
  note?: string
  color: string
}

type DetailItem = {
  label: string
  value: string
  note?: string
  icon: string
}

type DistributionRow = {
  name: string
  diesel: number | null
  gasoline: number | null
  icon: string
  color: string
}

const kpiItems: KpiItem[] = [
  {
    title: 'น้ำมันดิบเข้ากลั่น',
    value: 176.806,
    unit: 'ล้านลิตร',
    description: 'ปริมาณน้ำมันดิบที่เข้าสู่กระบวนการกลั่น',
    icon: 'i-lucide-droplets',
  },
  {
    title: 'การผลิตดีเซลพื้นฐานของโรงกลั่น',
    value: 72.721,
    unit: 'ล้านลิตร',
    description: 'ผลผลิตจากโรงกลั่น',
    icon: 'i-lucide-factory',
    secondary: 'เฉลี่ย มี.ค. 78.763 ล้านลิตร',
  },
  {
    title: 'การผลิตเบนซินพื้นฐานของโรงกลั่น',
    value: 51.203,
    unit: 'ล้านลิตร',
    description: 'รวมคลังโรงกลั่นและคลังภูมิภาค',
    icon: 'i-lucide-warehouse',
    secondary: 'เฉลี่ย มี.ค. 33.265 ล้านลิตร',
  },
  {
    title: 'รวมจำหน่ายดีเซล',
    value: 29.364,
    unit: 'ล้านลิตร',
    description: 'รวมลูกค้าทั่วไปและผู้ค้าส่ง',
    icon: 'i-lucide-fuel',
    secondary: 'เฉลี่ย มี.ค. 78.213 ล้านลิตร',
  },
  {
    title: 'รวมจำหน่ายเบนซิน',
    value: 16.473,
    unit: 'ล้านลิตร',
    description: 'ปริมาณจำหน่ายเบนซินรวม',
    icon: 'i-lucide-droplet',
    secondary: 'เฉลี่ย มี.ค. 32.851 ล้านลิตร',
  },
]

const crudeSources: SourceItem[] = [
  {
    label: 'ตะวันออกกลาง',
    value: 53,
    color: 'var(--oil-chart-1)',
  },
  {
    label: 'ตะวันออกไกล',
    value: 11,
    color: 'var(--oil-chart-3)',
  },
  {
    label: 'ประเทศไทย',
    value: 9,
    color: 'var(--oil-chart-4)',
  },
  {
    label: 'อื่น ๆ',
    value: 27,
    // note: 'สหรัฐฯ แอฟริกาตะวันตก และออสเตรเลีย',
    color: 'var(--oil-chart-2)',
  },
]

const procurementItems: DetailItem[] = [
  {
    label: 'สต๊อกดีเซลพื้นฐาน',
    value: '1.377 ล้านลิตร',
    note: 'เฉลี่ย ม.ค. 1.229 ล้านลิตร',
    icon: 'i-lucide-container',
  },
  {
    label: 'สต๊อกเบนซินพื้นฐาน',
    value: '0.629 ล้านลิตร',
    note: 'เฉลี่ย ม.ค. 0.725 ล้านลิตร',
    icon: 'i-lucide-container',
  },
  {
    label: 'ส่งออกดีเซลพื้นฐาน',
    value: '1.645 ล้านลิตร',
    note: 'สปป.ลาว และเมียนมา',
    icon: 'i-lucide-truck',
  },
  {
    label: 'ส่งออกเบนซิน 91–92',
    value: '0.048 ล้านลิตร',
    note: 'สปป.ลาว และเมียนมา',
    icon: 'i-lucide-ship',
  },
]

const productionItems: DetailItem[] = [
  {
    label: 'สต็อกกลุ่มดีเซล',
    value: '51.203 ล้านลิตร',
    note: 'เฉลี่ย มี.ค. 40 ล้านลิตร',
    icon: 'i-lucide-factory',
  },
  {
    label: 'สต็อกกลุ่มเบนซิน',
    value: '88 ล้านลิตร',
    note: 'เฉลี่ย มี.ค. 75 ล้านลิตร',
    icon: 'i-lucide-warehouse',
  },
  {
    label: 'การผลิตกลุ่มดีเซล',
    value: '31.432 ล้านลิตร',
    note: 'เฉลี่ย มี.ค. 77.478 ล้านลิตร',
    icon: 'i-lucide-leaf',
  },
  {
    label: 'การผลิตกลุ่มเบนซิน',
    value: '22.032 ล้านลิตร',
    note: 'เฉลี่ย มี.ค. 32.019 ล้านลิตร',
    icon: 'i-lucide-flask-conical',
  },
]

const distributionItems: DetailItem[] = [
  {
    label: 'ผู้ค้ามาตรา 7 — ดีเซล',
    value: '26.866 ล้านลิตร',
    note: 'เฉลี่ย มี.ค. 72.333 ล้านลิตร',
    icon: 'i-lucide-building-2',
  },
  {
    label: 'ผู้ค้ามาตรา 7 — เบนซิน',
    value: '16.472 ล้านลิตร',
    note: 'เฉลี่ย มี.ค. 31.491 ล้านลิตร',
    icon: 'i-lucide-building-2',
  },
  {
    label: 'ผู้ค้าส่ง (Jobber) — ดีเซล',
    value: '2.498 ล้านลิตร',
    note: 'เฉลี่ย มี.ค. 5.498 ล้านลิตร',
    icon: 'i-lucide-briefcase-business',
  },
  {
    label: 'ผู้ค้าส่ง (Jobber) — เบนซิน',
    value: '0.850 ล้านลิตร',
    note: 'เฉลี่ย มี.ค. 1.625 ล้านลิตร',
    icon: 'i-lucide-briefcase-business',
  },
]

const distributionRows: DistributionRow[] = [
  {
    name: 'อื่น ๆ',
    diesel: 0.461,
    gasoline: 0.238,
    icon: 'i-lucide-tractor',
    color: 'var(--oil-chart-1)',
  },
  {
    name: 'ราชการและรัฐวิสาหกิจ',
    diesel: 0.678,
    gasoline: 0.051,
    icon: 'i-lucide-landmark',
    color: 'var(--oil-chart-2)',
  },
  {
    name: 'ไฟฟ้า',
    diesel: null,
    gasoline: null,
    icon: 'i-lucide-zap',
    color: 'var(--oil-chart-3)',
  },
  {
    name: 'อุตสาหกรรม',
    diesel: 0.583,
    gasoline: 0.031,
    icon: 'i-lucide-factory',
    color: 'var(--oil-chart-4)',
  },
  {
    name: 'ขนส่ง',
    diesel: 0.578,
    gasoline: 0.005,
    icon: 'i-lucide-truck',
    color: 'var(--oil-chart-5)',
  },
  {
    name: 'สถานีบริการ',
    diesel: 24.566,
    gasoline: 16.148,
    icon: 'i-lucide-fuel',
    color: 'var(--primary)',
  },
]

const sourceGradient = computed(() => {
  let start = 0

  const parts = crudeSources.map((item) => {
    const end = start + item.value
    const segment = `${item.color} ${start}% ${end}%`
    start = end
    return segment
  })

  return `conic-gradient(${parts.join(', ')})`
})

const dieselTotal = computed(() =>
  distributionRows.reduce((total, row) => total + (row.diesel ?? 0), 0),
)

const gasolineTotal = computed(() =>
  distributionRows.reduce((total, row) => total + (row.gasoline ?? 0), 0),
)

const maxBarTotal = computed(() => Math.max(dieselTotal.value, gasolineTotal.value))

const BAR_HEIGHT = 120

function formatNumber(value: number, digits = 3) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

function segmentHeight(value: number | null) {
  if (!value || maxBarTotal.value <= 0)
    return '0px'

  return `${Math.max(
    (value / maxBarTotal.value) * BAR_HEIGHT,
    2,
  )}px`
}
</script>

<template>
  <div class="oil-dashboard w-full min-w-0 space-y-3">
    <!-- Header -->
    <header class="flex flex-wrap items-center justify-between gap-2">
      <div class="min-w-0">
        <h2 class="text-2xl font-bold tracking-tight">
          ห่วงโซ่อุปทานน้ามันกลุ่มดีเซลและเบนซิน
        </h2>

        <!-- <p class="text-sm text-muted-foreground">
          สรุปสถานการณ์น้ำมันกลุ่มดีเซลและเบนซิน · หน่วย: ล้านลิตร
        </p> -->
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <BaseDateRangePicker />
      </div>
    </header>

    <!-- KPI -->
    <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      <Card v-for="item in kpiItems" :key="item.title" class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
        <CardContent class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm font-medium text-muted-foreground">
                {{ item.title }}
              </p>

              <div class="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span class="text-2xl font-bold tracking-tight tabular-nums">
                  {{ formatNumber(item.value) }}
                </span>

                <span class="text-xs font-medium text-muted-foreground">
                  {{ item.unit }}
                </span>
              </div>
            </div>

            <div class="
                flex size-12 shrink-0 items-center justify-center rounded-2xl
                bg-primary/10 text-primary
              ">
              <Icon :name="item.icon" size="28" />
            </div>
          </div>

          <p class="mt-2 text-xs text-muted-foreground">
            {{ item.secondary || item.description }}
          </p>
        </CardContent>
      </Card>
    </section>

    <!-- Main dashboard -->
    <section
      class="
        grid min-w-0 gap-3
        xl:grid-cols-2
        2xl:grid-cols-5
      "
    >
      <!-- Left -->
      <div class="min-w-0 space-y-3 2xl:col-span-1">
        <!-- Crude sources -->
        <Card class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
          <CardHeader class="px-4 pb-2 pt-4">
            <CardTitle class="text-lg">
              การจัดหาน้ำมันดิบ
            </CardTitle>

            <!-- <CardDescription>
              สัดส่วนแหล่งผลิตน้ำมันดิบที่นำเข้ากลั่น
            </CardDescription> -->
          </CardHeader>

          <CardContent class="px-4 pb-4 pt-1">
            <div class="source-layout">
              <div class="source-donut" :style="{ background: sourceGradient }">
                <!-- <div class="source-donut-hole">
                  <span class="text-xs text-muted-foreground">เข้ากลั่น</span>
                  <strong class="text-lg tabular-nums">176.806</strong>
                  <span class="text-[11px] text-muted-foreground">ล้านลิตร</span>
                </div> -->
              </div>

              <div class="min-w-0 space-y-2.5">
                <div v-for="source in crudeSources" :key="source.label" class="flex items-start gap-2">
                  <span class="mt-1 size-2.5 shrink-0 rounded-full" :style="{ backgroundColor: source.color }" />

                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-sm font-medium">
                        {{ source.label }}
                      </p>

                      <span class="text-sm font-semibold tabular-nums">
                        {{ source.value }}%
                      </span>
                    </div>

                    <p v-if="source.note" class="text-xs leading-4 text-muted-foreground">
                      {{ source.note }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Procurement -->
        <Card class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
          <CardHeader class="px-4 pb-2 pt-4">
            <CardTitle class="text-lg">
              การจัดหาและสต๊อก
            </CardTitle>

            <!-- <CardDescription>
              ปริมาณคงเหลือและการส่งออก
            </CardDescription> -->
          </CardHeader>

          <CardContent class="grid gap-2 px-4 pb-4 pt-1">
            <div v-for="item in procurementItems" :key="item.label" class="detail-row">
              <div class="detail-icon">
                <Icon :name="item.icon" size="19" />
              </div>

              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium">
                  {{ item.label }}
                </p>

                <p class="text-sm font-bold tabular-nums text-primary">
                  {{ item.value }}
                </p>

                <p v-if="item.note" class="text-xs text-muted-foreground">
                  {{ item.note }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Center -->
      <div class="min-w-0 space-y-3 2xl:col-span-2">
        <Card class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
          <CardHeader class="px-4 pb-2 pt-4">
            <CardTitle class="text-lg">
              สต็อกถังเก็บน้ำมันผสมและการผลิต(รวมคลังโรงกลั่นและคลังภูมิภาค)
            </CardTitle>

            <!-- <CardDescription>
              ผลผลิตจากโรงกลั่นและน้ำมันชีวภาพ
            </CardDescription> -->
          </CardHeader>

          <CardContent class="grid gap-2 px-4 pb-4 pt-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <div v-for="item in productionItems" :key="item.label" class="detail-card">
              <div class="detail-icon">
                <Icon :name="item.icon" size="20" />
              </div>

              <div class="min-w-0">
                <p class="text-sm font-medium">
                  {{ item.label }}
                </p>

                <p class="mt-1 text-base font-bold tabular-nums text-primary">
                  {{ item.value }}
                </p>

                <p v-if="item.note" class="mt-1 text-xs leading-4 text-muted-foreground">
                  {{ item.note }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
          <CardHeader class="px-4 pb-2 pt-4">
            <CardTitle class="text-lg">
              การกระจายน้ำมัน
            </CardTitle>

            <!-- <CardDescription>
              ผู้ค้ามาตรา 7 และผู้ค้าส่ง
            </CardDescription> -->
          </CardHeader>

          <CardContent class="grid gap-2 px-4 pb-4 pt-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <div v-for="item in distributionItems" :key="item.label" class="detail-card">
              <div class="detail-icon">
                <Icon :name="item.icon" size="20" />
              </div>

              <div class="min-w-0">
                <p class="text-sm font-medium">
                  {{ item.label }}
                </p>

                <p class="mt-1 text-base font-bold tabular-nums text-primary">
                  {{ item.value }}
                </p>

                <p v-if="item.note" class="mt-1 text-xs leading-4 text-muted-foreground">
                  {{ item.note }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div class="grid gap-3 sm:grid-cols-2">
          <Card class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
            <CardContent class="flex items-center gap-3 p-4">
              <div class="detail-icon">
                <Icon name="i-lucide-factory" size="21" />
              </div>

              <div class="min-w-0">
                <p class="text-sm font-medium text-foreground">
                  จำหน่ายภาคอุตสาหกรรม
                </p>

                <p class="text-base font-bold tabular-nums text-primary">
                  0.024 ล้านลิตร
                </p>

                <p class="text-xs text-muted-foreground">
                  เฉลี่ย มี.ค. 0.270 ล้านลิตร
                </p>
              </div>
            </CardContent>
          </Card>

          <Card class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
            <CardContent class="flex items-center gap-3 p-4">
              <div class="detail-icon">
                <Icon name="i-lucide-boxes" size="21" />
              </div>

              <div class="min-w-0">
                <p class="text-sm font-medium text-foreground">
                  สต๊อกผสมน้ำมันชีวภาพ
                </p>

                <p class="text-base font-bold tabular-nums text-primary">
                  ไบโอดีเซล 2.189 ล้านลิตร
                </p>

                <p class="text-base font-bold tabular-nums text-primary">
                  เอทานอล 2.432 ล้านลิตร
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Right -->
      <Card
        class="
          min-w-0 gap-0 overflow-hidden rounded-2xl border-border/80 py-0
          shadow-sm
          xl:col-span-2
          2xl:col-span-2
        "
      >
        <CardHeader class="px-4 pb-3 pt-4">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle class="text-lg">
                ปริมาณจำหน่ายตามปลายทาง
              </CardTitle>

              <!-- <CardDescription>
                แยกตามประเภทลูกค้าและชนิดน้ำมัน
              </CardDescription> -->
            </div>

            <div class="flex gap-5 text-right">
              <!-- <div>
                <p class="text-xs text-muted-foreground">
                  ดีเซล
                </p>

                <p class="text-lg font-bold tabular-nums text-primary">
                  {{ formatNumber(dieselTotal) }}
                </p>
              </div> -->

              <!-- <div>
                <p class="text-xs text-muted-foreground">
                  เบนซิน
                </p>

                <p class="text-lg font-bold tabular-nums text-primary">
                  {{ formatNumber(gasolineTotal) }}
                </p>
              </div> -->
            </div>
          </div>
        </CardHeader>

        <CardContent class="p-0">
          <div class="sales-chart">
            <div class="stack-column">
              <div class="stack-label">
                <span>ดีเซล</span>
                <strong>{{ formatNumber(dieselTotal) }}</strong>
              </div>

              <div class="stack-bar">
                <span v-for="row in distributionRows" :key="`diesel-${row.name}`" class="stack-segment" :style="{
                  height: segmentHeight(row.diesel),
                  backgroundColor: row.color,
                }" :title="`${row.name}: ${row.diesel ?? '-'}`" />
              </div>
            </div>

            <div class="stack-column">
              <div class="stack-label">
                <span>เบนซิน</span>
                <strong>{{ formatNumber(gasolineTotal) }}</strong>
              </div>

              <div class="stack-bar">
                <span v-for="row in distributionRows" :key="`gasoline-${row.name}`" class="stack-segment" :style="{
                  height: segmentHeight(row.gasoline),
                  backgroundColor: row.color,
                }" :title="`${row.name}: ${row.gasoline ?? '-'}`" />
              </div>
            </div>
          </div>

          <div class="overflow-x-auto border-t">
            <table class="distribution-table">
              <thead>
                <tr>
                  <th>ประเภทการจำหน่าย</th>
                  <th>ดีเซล</th>
                  <th>เบนซิน</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="row in distributionRows" :key="row.name">
                  <td>
                    <div class="flex items-center gap-2.5">
                      <span class="size-2.5 shrink-0 rounded-sm" :style="{ backgroundColor: row.color }" />

                      <div class="detail-icon size-8">
                        <Icon :name="row.icon" size="16" />
                      </div>

                      <span class="font-medium">
                        {{ row.name }}
                      </span>
                    </div>
                  </td>

                  <td class="tabular-nums">
                    {{ row.diesel === null ? '-' : formatNumber(row.diesel) }}
                  </td>

                  <td class="tabular-nums">
                    {{ row.gasoline === null ? '-' : formatNumber(row.gasoline) }}
                  </td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <td>รวม</td>
                  <td>{{ formatNumber(dieselTotal) }}</td>
                  <td>{{ formatNumber(gasolineTotal) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>

<style scoped>
.oil-dashboard {
  --oil-chart-1: var(--primary);
  --oil-chart-2: color-mix(in oklab, var(--primary) 55%, #8b5cf6);
  --oil-chart-3: color-mix(in oklab, var(--primary) 50%, #06b6d4);
  --oil-chart-4: color-mix(in oklab, var(--primary) 45%, #f97316);
  --oil-chart-5: color-mix(in oklab, var(--primary) 50%, #eab308);
}

.oil-dashboard :deep([data-slot='card-header']) {
  gap: 0.2rem;
}

.oil-dashboard :deep([data-slot='card-description']) {
  line-height: 1.3;
}

.source-layout {
  display: grid;
  grid-template-columns: minmax(130px, 0.8fr) minmax(0, 1fr);
  align-items: center;
  gap: 1rem;
}

.source-donut {
  position: relative;
  width: min(100%, 165px);
  aspect-ratio: 1;
  margin: 0 auto;
  border-radius: 9999px;
}

.source-donut::after {
  position: absolute;
  inset: 0;
  border: 1px solid color-mix(in oklab, var(--border) 70%, transparent);
  border-radius: inherit;
  content: '';
}

.source-donut-hole {
  position: absolute;
  inset: 27%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: inherit;
  background: var(--card);
  text-align: center;
}

.detail-row,
.detail-card {
  display: flex;
  min-width: 0;
  gap: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.875rem;
  background: color-mix(in oklab, var(--muted) 18%, var(--card));
}

.detail-row {
  align-items: center;
  padding: 0.7rem;
}

.detail-card {
  align-items: flex-start;
  padding: 0.8rem;
}

.detail-icon {
  display: flex;
  width: 2.4rem;
  height: 2.4rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: var(--primary);
  color: var(--primary-foreground);
}

.sales-chart {
  display: flex;
  min-height: 175px;
  align-items: flex-end;
  justify-content: center;
  gap: clamp(2rem, 5vw, 4rem);
  padding: 0.4rem 1rem 0.65rem;
  background:
    linear-gradient(to bottom,
      color-mix(in oklab, var(--border) 55%, transparent) 1px,
      transparent 1px);
  background-size: 100% 32px;
}

.stack-column {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.4rem;
}

.stack-label {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  font-size: 0.8rem;
  color: var(--muted-foreground);
}

.stack-label strong {
  color: var(--foreground);
  font-size: 1rem;
}

.stack-bar {
  display: flex;
  width: clamp(68px, 5vw, 88px);
  height: 120px;
  flex-direction: column-reverse;
  justify-content: flex-start;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 0.75rem 0.75rem 0 0;
  background: var(--muted);
}

.stack-segment {
  display: block;
  width: 100%;
  min-height: 0;
}

.distribution-table {
  width: 100%;
  min-width: 520px;
  border-collapse: collapse;
  color: var(--foreground);
  font-size: 0.82rem;
}

.distribution-table th,
.distribution-table td {
  padding: 0.65rem 0.8rem;
  border-bottom: 1px solid var(--border);
  text-align: right;
}

.distribution-table th {
  background: color-mix(in oklab, var(--muted) 38%, var(--card));
  color: var(--muted-foreground);
  font-weight: 600;
}

.distribution-table th:first-child,
.distribution-table td:first-child {
  text-align: left;
}

.distribution-table tbody tr:hover td {
  background: color-mix(in oklab, var(--muted) 38%, transparent);
}

.distribution-table tfoot td {
  border-bottom: 0;
  background: color-mix(in oklab, var(--primary) 8%, var(--card));
  font-weight: 700;
}

@media (max-width: 1280px) {
  .source-layout {
    grid-template-columns: minmax(120px, 0.55fr) minmax(0, 1fr);
  }
}

@media (max-width: 768px) {
  .source-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .sales-chart {
    min-height: 165px;
    gap: 2rem;
  }
}
</style>
