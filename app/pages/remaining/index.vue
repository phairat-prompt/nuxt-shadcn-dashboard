<script setup lang="ts">
import { computed, ref } from 'vue'

type FuelRow = {
  rank: string
  group: string
  legalReserve: number
  workingStock: number
  totalStock: number
  dailyDemand: number
  legalDays: number
  actualDays: number
}

type ChartItem = {
  name: string
  legalReserve: number
  workingStock: number
  totalStock: number
  legalDays: number
  actualDays: number
}

type KpiItem = {
  title: string
  legalReserve: number
  totalStock: number
  actualDays: number
  stockUnit: string
  description: string
  icon: string
  tone: 'blue' | 'green' | 'violet' | 'purple' | 'orange'
}

const reportDate = ref('01/07/2568')
const currentPage = ref(1)
const perPage = ref(8)

const rows: FuelRow[] = [
  {
    rank: '1.',
    group: 'กลุ่มที่ 1 น้ำมันเบนซิน',
    legalReserve: 1405.84,
    workingStock: 1274.44,
    totalStock: 2680.28,
    dailyDemand: 44.94,
    legalDays: 31.28,
    actualDays: 59.67,
  },
  {
    rank: '2.',
    group: 'กลุ่มที่ 2 เอทานอล',
    legalReserve: 139.88,
    workingStock: 262.68,
    totalStock: 402.56,
    dailyDemand: 21.80,
    legalDays: 6.42,
    actualDays: 18.47,
  },
  {
    rank: '3.',
    group: 'กลุ่มที่ 3 น้ำมันดีเซลหมุนเร็ว',
    legalReserve: 3431.55,
    workingStock: 11116.34,
    totalStock: 14547.89,
    dailyDemand: 192.30,
    legalDays: 17.85,
    actualDays: 75.66,
  },
  {
    rank: '4.',
    group: 'กลุ่มที่ 4 ไบโอดีเซล',
    legalReserve: 15.89,
    workingStock: 56.82,
    totalStock: 72.71,
    dailyDemand: 2.97,
    legalDays: 5.35,
    actualDays: 24.46,
  },
  {
    rank: '5.',
    group: 'กลุ่มที่ 5 น้ำมันเตา ชนิดที่ 1',
    legalReserve: 437.84,
    workingStock: 1487.00,
    totalStock: 1924.84,
    dailyDemand: 21.71,
    legalDays: 20.16,
    actualDays: 88.68,
  },
  {
    rank: '6.',
    group: 'กลุ่มที่ 6 น้ำมันเตา ชนิดที่ 2',
    legalReserve: 320.00,
    workingStock: 1100.00,
    totalStock: 1420.00,
    dailyDemand: 18.68,
    legalDays: 17.13,
    actualDays: 76.00,
  },
  {
    rank: '7.',
    group: 'กลุ่มที่ 7 น้ำมันเตา ชนิดที่ 5',
    // TODO: แทนที่ค่า 0 ด้วยข้อมูลจริงจาก API Gateway
    legalReserve: 0,
    workingStock: 0,
    totalStock: 0,
    dailyDemand: 0,
    legalDays: 0,
    actualDays: 0,
  },
  {
    rank: '8.',
    group: 'กลุ่มที่ 8 น้ำมันสำหรับอากาศยาน',
    legalReserve: 528.60,
    workingStock: 1196.40,
    totalStock: 1725.00,
    dailyDemand: 18.90,
    legalDays: 27.97,
    actualDays: 91.27,
  },
]

const chartData: ChartItem[] = [
  {
    name: 'เบนซิน',
    legalReserve: 1405.84,
    workingStock: 1274.44,
    totalStock: 2680.28,
    legalDays: 31.28,
    actualDays: 59.67,
  },
  {
    name: 'เอทานอล',
    legalReserve: 139.88,
    workingStock: 262.68,
    totalStock: 402.56,
    legalDays: 6.42,
    actualDays: 18.47,
  },
  {
    name: 'ดีเซลหมุนเร็ว',
    legalReserve: 3431.55,
    workingStock: 11116.34,
    totalStock: 14547.89,
    legalDays: 17.85,
    actualDays: 75.66,
  },
  {
    name: 'ไบโอดีเซล',
    legalReserve: 15.89,
    workingStock: 56.82,
    totalStock: 72.71,
    legalDays: 5.35,
    actualDays: 24.46,
  },
  {
    name: 'เตา ชนิดที่ 1',
    legalReserve: 437.84,
    workingStock: 1487.00,
    totalStock: 1924.84,
    legalDays: 20.16,
    actualDays: 88.68,
  },
  {
    name: 'เตา ชนิดที่ 2',
    legalReserve: 320.00,
    workingStock: 1100.00,
    totalStock: 1420.00,
    legalDays: 17.13,
    actualDays: 76.00,
  },
  {
    name: 'เตา ชนิดที่ 5',
    // TODO: แทนที่ค่า 0 ด้วยข้อมูลจริงจาก API Gateway
    legalReserve: 0,
    workingStock: 0,
    totalStock: 0,
    legalDays: 0,
    actualDays: 0,
  },
  {
    name: 'อากาศยาน',
    legalReserve: 528.60,
    workingStock: 1196.40,
    totalStock: 1725.00,
    legalDays: 27.97,
    actualDays: 91.27,
  },
]

const kpis: KpiItem[] = [
  {
    title: 'น้ำมันดิบ (คงเหลือ)',
    legalReserve: 7831.08,
    totalStock: 10868.99,
    actualDays: 113.59,
    stockUnit: 'ล้านลิตร',
    description: 'น้ำมันดิบที่อยู่ภายในประเทศ',
    icon: 'i-lucide-cylinder',
    tone: 'orange',
  },
  {
    title: 'น้ำมันดิบระหว่างการขนส่ง',
    legalReserve: 1240.60,
    totalStock: 2559.60,
    actualDays: 98.30,
    stockUnit: 'ล้านลิตร',
    description: 'ปริมาณที่อยู่ระหว่างเดินทางเข้าประเทศ',
    icon: 'i-lucide-ship',
    tone: 'blue',
  },
  {
    title: 'น้ำมันสำเร็จรูป (รวม)',
    legalReserve: 7036.78,
    totalStock: 24061.62,
    actualDays: 69.11,
    stockUnit: 'ล้านลิตร',
    description: 'รวมผลิตภัณฑ์น้ำมันสำเร็จรูปพร้อมใช้',
    icon: 'i-lucide-droplets',
    tone: 'violet',
  },
  {
    title: 'ก๊าซปิโตรเลียมเหลว',
    legalReserve: 198.40,
    totalStock: 660.50,
    actualDays: 40.77,
    stockUnit: 'ล้านลิตร',
    description: 'LPG คงเหลือในระบบ',
    icon: 'i-lucide-flame',
    tone: 'green',
  },
  {
    title: 'น้ำมันที่ใช้ในกิจการทหาร (รวม)',
    legalReserve: 290.00,
    totalStock: 1130.00,
    actualDays: 160.00,
    stockUnit: 'ล้านลิตร',
    description: 'ปริมาณรวมสำหรับกิจการทหาร',
    icon: 'i-lucide-shield',
    tone: 'purple',
  },
]

const totalPages = computed(() => Math.max(1, Math.ceil(rows.length / perPage.value)))
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return rows.slice(start, start + perPage.value)
})
const firstRow = computed(() => rows.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1)
const lastRow = computed(() => Math.min(currentPage.value * perPage.value, rows.length))
const maxStockValue = computed(() => Math.max(...chartData.flatMap(item => [item.legalReserve, item.workingStock, item.totalStock])))
const maxDays = 180

const legalPoints = computed(() => chartData.map((item, index) => {
  const x = 46 + index * (840 / (chartData.length - 1))
  const y = 18 + (1 - item.legalDays / maxDays) * 182
  return `${x},${y}`
}).join(' '))

const actualPoints = computed(() => chartData.map((item, index) => {
  const x = 46 + index * (840 / (chartData.length - 1))
  const y = 18 + (1 - item.actualDays / maxDays) * 182
  return `${x},${y}`
}).join(' '))

function formatNumber(value: number) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function barHeight(value: number) {
  if (value <= 0 || maxStockValue.value <= 0) return '0%'
  return `${Math.max((value / maxStockValue.value) * 100, 2)}%`
}

function goToPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

function updatePerPage() {
  currentPage.value = 1
}
</script>

<template>
  <div class="fuel-stock-dashboard w-full min-w-0 space-y-3">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-2xl font-bold tracking-tight">
          ภาพรวมปริมาณน้ำมันเชื้อเพลิงคงเหลือ และปริมาณสำรองตามกฎหมาย
        </h1>

        <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>ข้อมูลจาก API Gateway</span>
          <Separator orientation="vertical" class="h-3" />
          <span>ช่วงข้อมูล: {{ reportDate }} - {{ reportDate }}</span>
          <Separator orientation="vertical" class="h-3" />
          <span>อัปเดตล่าสุด: {{ reportDate }} 23:59 น.</span>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <BaseDateRangePicker />

        <!-- <Button variant="outline">
          <Icon name="i-lucide-refresh-cw" class="mr-2" size="16" />
          รีเฟรช
        </Button>

        <Button>
          <Icon name="i-lucide-download" class="mr-2" size="16" />
          ส่งออก
        </Button> -->
      </div>
    </header>

    <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      <Card
        v-for="item in kpis"
        :key="item.title"
        class="kpi-card gap-0 overflow-hidden rounded-2xl border-border/80 py-0 shadow-sm"
      >
        <CardContent class="p-0">
          <div class="p-4 pb-3">
            <div class="flex items-start gap-3">
              <div class="kpi-icon" :class="`kpi-tone-${item.tone}`">
                <Icon :name="item.icon" size="23" />
              </div>

              <div class="min-w-0 flex-1">
                <p class="min-h-10 text-sm font-semibold leading-5">
                  {{ item.title }}
                </p>

                <div class="mt-1 flex flex-wrap items-baseline gap-x-1.5">
                  <span class="text-xl font-bold tracking-tight tabular-nums">
                    {{ formatNumber(item.totalStock) }}
                  </span>

                  <span class="text-xs text-muted-foreground">
                    {{ item.stockUnit }}
                  </span>
                </div>

                <p class="mt-1 text-[11px] text-muted-foreground">
                  สำรองตามกฎหมาย {{ formatNumber(item.legalReserve) }}
                  {{ item.stockUnit }}
                </p>
              </div>
            </div>
          </div>

          <div class="kpi-days-panel" :class="`kpi-days-${item.tone}`">
            <div>
              <p class="text-[11px] font-medium opacity-80">
                จำนวนวันที่ใช้ได้
              </p>

              <p class="mt-0.5 text-[10px] opacity-70">
                {{ item.description }}
              </p>
            </div>

            <div class="shrink-0 text-right">
              <span class="text-3xl font-black leading-none tabular-nums">
                {{ formatNumber(item.actualDays) }}
              </span>

              <span class="ml-1 text-sm font-bold">
                วัน
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    <section class="grid min-w-0 gap-3 xl:grid-cols-2">
      <Card class="min-w-0 gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
        <CardHeader class="px-4 pb-2 pt-4">
          <CardTitle class="text-base">
            เปรียบเทียบปริมาณสำรองและปริมาณคงเหลือ น้ำมันสำเร็จรูป 8 กลุ่ม
          </CardTitle>
          <CardDescription>หน่วย: ล้านลิตร</CardDescription>
        </CardHeader>

        <CardContent class="px-4 pb-4 pt-0">
          <div class="chart-legend">
            <span><i class="legend-box legend-legal" />ปริมาณสำรองตามกฎหมาย</span>
            <span><i class="legend-box legend-working" />ปริมาณสำรองทางการค้า</span>
            <span><i class="legend-box legend-total" />ปริมาณน้ำมันคงเหลือ</span>
          </div>

          <div class="bar-chart-scroll">
            <div class="bar-chart-grid">
              <div v-for="item in chartData" :key="item.name" class="bar-group">
                <div class="bar-area">
                  <div class="bar-track">
                    <div class="bar-value bar-legal" :style="{ height: barHeight(item.legalReserve) }" :title="`${item.name}: ${formatNumber(item.legalReserve)}`" />
                  </div>
                  <div class="bar-track">
                    <div class="bar-value bar-working" :style="{ height: barHeight(item.workingStock) }" :title="`${item.name}: ${formatNumber(item.workingStock)}`" />
                  </div>
                  <div class="bar-track">
                    <div class="bar-value bar-total" :style="{ height: barHeight(item.totalStock) }" :title="`${item.name}: ${formatNumber(item.totalStock)}`" />
                  </div>
                </div>
                <div class="bar-label">{{ item.name }}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="min-w-0 gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
        <CardHeader class="px-4 pb-2 pt-4">
          <CardTitle class="text-base">
            จำนวนวันที่ใช้ได้ของน้ำมันสำเร็จรูป 8 กลุ่ม
          </CardTitle>
          <CardDescription>หน่วย: วัน</CardDescription>
        </CardHeader>

        <CardContent class="px-4 pb-4 pt-0">
          <div class="chart-legend">
            <span><i class="legend-line legend-days-legal" />จำนวนวันที่ใช้ได้ตามกฎหมาย</span>
            <span><i class="legend-line legend-days-actual" />จำนวนวันที่ใช้ได้จริง</span>
          </div>

          <div class="line-chart-scroll">
            <div class="line-chart-wrap">
              <svg viewBox="0 0 940 230" preserveAspectRatio="none" class="line-chart" role="img" aria-label="กราฟจำนวนวันที่ใช้ได้">
                <g class="grid-lines">
                  <line v-for="tick in [0, 30, 60, 90, 120, 150, 180]" :key="tick" x1="46" x2="886" :y1="18 + (1 - tick / maxDays) * 182" :y2="18 + (1 - tick / maxDays) * 182" />
                </g>

                <polyline :points="legalPoints" class="days-line days-line-legal" />
                <polyline :points="actualPoints" class="days-line days-line-actual" />

                <circle
                  v-for="(item, index) in chartData"
                  :key="`legal-${item.name}`"
                  :cx="46 + index * (840 / (chartData.length - 1))"
                  :cy="18 + (1 - item.legalDays / maxDays) * 182"
                  r="4"
                  class="point-legal"
                >
                  <title>{{ item.name }}: {{ item.legalDays.toFixed(2) }} วัน</title>
                </circle>

                <circle
                  v-for="(item, index) in chartData"
                  :key="`actual-${item.name}`"
                  :cx="46 + index * (840 / (chartData.length - 1))"
                  :cy="18 + (1 - item.actualDays / maxDays) * 182"
                  r="4"
                  class="point-actual"
                >
                  <title>{{ item.name }}: {{ item.actualDays.toFixed(2) }} วัน</title>
                </circle>
              </svg>

              <div class="line-labels">
                <span v-for="item in chartData" :key="item.name">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    <Card class="min-w-0 gap-0 overflow-hidden rounded-2xl border-border/80 py-0 shadow-sm">
      <CardHeader class="px-4 pb-3 pt-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle class="text-base">
              สรุปปริมาณน้ำมันเชื้อเพลิงคงเหลือและจำนวนวันที่ใช้ได้ของน้ำมันสำเร็จรูป 8 กลุ่ม
            </CardTitle>
            <CardDescription>หน่วย: ล้านลิตร, วัน</CardDescription>
          </div>

          <Badge variant="secondary">{{ rows.length }} รายการ</Badge>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="stock-table-scroll">
          <table class="stock-table">
            <thead>
              <tr>
                <th class="rank-column">ลำดับ</th>
                <th class="group-column">กลุ่มน้ำมัน</th>
                <th>ปริมาณสำรองตามกฎหมาย<span>(Legal Reserve)</span></th>
                <th>ปริมาณสำรองทางการค้า<span>(Working Stock)</span></th>
                <th>ปริมาณน้ำมันคงเหลือ<span>(Total Stock)</span></th>
                <th>ความต้องการเฉลี่ยต่อวัน<span>(ล้านลิตร/วัน)</span></th>
                <th>วันที่ใช้ได้ตามกฎหมาย<span>(วัน)</span></th>
                <th>วันที่ใช้ได้จริง<span>(วัน)</span></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="row in paginatedRows" :key="`${row.rank}-${row.group}`">
                <td class="rank-cell">{{ row.rank }}</td>
                <td class="group-cell">{{ row.group }}</td>
                <td>{{ formatNumber(row.legalReserve) }}</td>
                <td>{{ formatNumber(row.workingStock) }}</td>
                <td class="total-cell">{{ formatNumber(row.totalStock) }}</td>
                <td>{{ formatNumber(row.dailyDemand) }}</td>
                <td>{{ formatNumber(row.legalDays) }}</td>
                <td>{{ formatNumber(row.actualDays) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-footer">
          <p class="text-xs text-muted-foreground">
            แสดง {{ firstRow }} ถึง {{ lastRow }} จาก {{ rows.length }} รายการ
          </p>

          <div class="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="icon" :disabled="currentPage === 1" @click="goToPage(1)">
              <Icon name="i-lucide-chevrons-left" size="16" />
            </Button>
            <Button variant="outline" size="icon" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
              <Icon name="i-lucide-chevron-left" size="16" />
            </Button>
            <Button size="icon">{{ currentPage }}</Button>
            <Button variant="outline" size="icon" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
              <Icon name="i-lucide-chevron-right" size="16" />
            </Button>
            <Button variant="outline" size="icon" :disabled="currentPage === totalPages" @click="goToPage(totalPages)">
              <Icon name="i-lucide-chevrons-right" size="16" />
            </Button>

            <select v-model.number="perPage" class="per-page-select" @change="updatePerPage">
              <option :value="8">8 / หน้า</option>
              <option :value="10">10 / หน้า</option>
              <option :value="20">20 / หน้า</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
.fuel-stock-dashboard :deep([data-slot='card-header']) { gap: 0.25rem; }

.kpi-icon {
  display: flex;
  width: 2.75rem;
  height: 2.75rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 0.9rem;
}

.kpi-tone-blue { background: color-mix(in oklab, var(--primary) 12%, var(--card)); color: var(--primary); }
.kpi-tone-green { background: color-mix(in oklab, #16a34a 12%, var(--card)); color: #16a34a; }
.kpi-tone-violet { background: color-mix(in oklab, #7c3aed 12%, var(--card)); color: #7c3aed; }
.kpi-tone-purple { background: color-mix(in oklab, #9333ea 12%, var(--card)); color: #9333ea; }
.kpi-tone-orange { background: color-mix(in oklab, #f97316 12%, var(--card)); color: #f97316; }
.kpi-card {
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.kpi-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.08);
}

.kpi-days-panel {
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border);
}

.kpi-days-blue {
  background: color-mix(in oklab, var(--primary) 10%, var(--card));
  color: var(--primary);
}

.kpi-days-green {
  background: color-mix(in oklab, #16a34a 10%, var(--card));
  color: #15803d;
}

.kpi-days-violet {
  background: color-mix(in oklab, #7c3aed 10%, var(--card));
  color: #7c3aed;
}

.kpi-days-purple {
  background: color-mix(in oklab, #9333ea 10%, var(--card));
  color: #9333ea;
}

.kpi-days-orange {
  background: color-mix(in oklab, #f97316 10%, var(--card));
  color: #ea580c;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.6rem 1rem;
  margin-bottom: 0.75rem;
  color: var(--muted-foreground);
  font-size: 0.7rem;
}

.chart-legend span { display: flex; align-items: center; gap: 0.35rem; }
.legend-box { display: inline-block; width: 0.7rem; height: 0.7rem; border-radius: 0.15rem; }
.legend-legal { background: var(--primary); }
.legend-working { background: #22c55e; }
.legend-total { background: #8b5cf6; }
.legend-line { display: inline-block; width: 1.3rem; height: 0; border-top: 2px solid currentColor; }
.legend-days-legal { color: var(--primary); }
.legend-days-actual { color: #16a34a; }

.bar-chart-scroll,
.line-chart-scroll { width: 100%; overflow-x: auto; padding-bottom: 0.25rem; }

.bar-chart-grid {
  display: grid;
  min-width: 760px;
  height: 285px;
  grid-template-columns: repeat(8, minmax(76px, 1fr));
  align-items: end;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem 0;
  background: repeating-linear-gradient(
    to top,
    color-mix(in oklab, var(--border) 68%, transparent) 0,
    color-mix(in oklab, var(--border) 68%, transparent) 1px,
    transparent 1px,
    transparent 45px
  );
}

.bar-group { display: grid; min-width: 0; grid-template-rows: 230px 45px; gap: 0.35rem; align-items: end; }
.bar-area { display: flex; height: 230px; align-items: flex-end; justify-content: center; gap: 0.18rem; }
.bar-track { display: flex; width: 30%; height: 100%; align-items: flex-end; }
.bar-value { width: 100%; min-height: 0; border-radius: 0.2rem 0.2rem 0 0; transition: height 0.2s ease; }
.bar-legal { background: var(--primary); }
.bar-working { background: #22c55e; }
.bar-total { background: #8b5cf6; }
.bar-label { overflow: hidden; color: var(--muted-foreground); text-align: center; font-size: 0.58rem; line-height: 1.15; }

.line-chart-wrap { position: relative; min-width: 760px; }
.line-chart { display: block; width: 100%; height: 230px; }
.grid-lines line { stroke: color-mix(in oklab, var(--border) 75%, transparent); stroke-width: 1; }
.days-line { fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
.days-line-legal { stroke: var(--primary); }
.days-line-actual { stroke: #16a34a; }
.point-legal { fill: var(--primary); stroke: var(--card); stroke-width: 2; }
.point-actual { fill: #16a34a; stroke: var(--card); stroke-width: 2; }
.line-labels { display: grid; min-width: 760px; grid-template-columns: repeat(8, minmax(82px, 1fr)); padding: 0 0.3rem; color: var(--muted-foreground); text-align: center; font-size: 0.58rem; line-height: 1.1; }
.line-labels span { overflow: hidden; }

.stock-table-scroll { width: 100%; overflow: auto; }
.stock-table { width: 100%; min-width: 1180px; border-collapse: separate; border-spacing: 0; font-size: 0.76rem; }
.stock-table th,
.stock-table td { height: 42px; padding: 0.55rem 0.7rem; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); text-align: center; vertical-align: middle; }
.stock-table th:last-child,
.stock-table td:last-child { border-right: 0; }
.stock-table thead th { position: sticky; top: 0; z-index: 2; background: color-mix(in oklab, var(--primary) 8%, var(--card)); color: var(--foreground); font-weight: 600; line-height: 1.25; }
.stock-table thead th span { display: block; margin-top: 0.12rem; font-size: 0.68rem; }
.stock-table tbody tr:hover td { background: color-mix(in oklab, var(--muted) 35%, transparent); }
.rank-column { width: 62px; }
.group-column { width: 220px; }
.rank-cell { color: var(--muted-foreground); }
.group-cell { text-align: left !important; font-weight: 500; white-space: nowrap; }
.total-cell { font-weight: 700; }
.table-footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.75rem 1rem; border-top: 1px solid var(--border); }
.per-page-select { height: 2.25rem; padding: 0 0.75rem; border: 1px solid var(--input); border-radius: 0.55rem; background: var(--background); color: var(--foreground); font-size: 0.75rem; }

@media (max-width: 768px) {
  .bar-chart-grid { height: 255px; }
  .bar-group { grid-template-rows: 200px 45px; }
  .bar-area { height: 200px; }
}
</style>
