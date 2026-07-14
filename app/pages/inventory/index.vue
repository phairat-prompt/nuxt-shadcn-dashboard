<script setup lang="ts">
type Point = {
  x: number
  y: number
}

type ChartScale = {
  min: number
  max: number
  width?: number
  height?: number
  padX?: number
  padTop?: number
  padBottom?: number
}

const ranges = ['30 Days', '3 Months', '1 Year']
const selectedRange = ref('30 Days')

const statCards = [
  {
    title: 'Daily Revenue',
    value: '$612.10',
    change: '+20% ($223)',
    note: 'Last 30 Days',
    icon: 'i-lucide-credit-card',
    positive: true,
  },
  {
    title: 'Active Subscribers',
    value: '42,243',
    change: '+12% ($1,456)',
    note: 'Last 30 Days',
    icon: 'i-lucide-user',
    positive: true,
  },
  {
    title: 'New Subscribers',
    value: '42,243',
    change: '+12% ($1,456)',
    note: 'Last 30 Days',
    icon: 'i-lucide-user-plus',
    positive: true,
  },
  {
    title: 'Churn Rate',
    value: '2.5%',
    change: '+0.3% (↑)',
    note: 'Last 30 Days',
    icon: 'i-lucide-user-minus',
    positive: false,
  },
]

const subscriberValues = [
  2200, 3100, 2800, 2900, 8500, 3900, 4600, 5400, 7600, 7900,
  6300, 5200, 3500, 5200, 6600, 8100, 9300, 10400, 8200, 10100,
  7800, 9100, 10100, 11600, 13500, 14000, 14800, 14300, 15000, 1500,
  3000, 2600, 2500, 8500, 6500, 4000, 4800, 6100, 7200, 7800,
  6200, 4800, 3500, 5300, 7100, 8200, 9000, 10300, 10400, 9300,
  10000, 7900, 8900, 10100, 12300, 13200, 13700, 15100, 15800, 16200,
]

const browserStats = [
  {
    name: 'Chrome',
    value: 65.2,
    color: 'var(--chart-info)',
  },
  {
    name: 'Safari',
    value: 18.7,
    color: 'var(--chart-primary)',
  },
  {
    name: 'Edge',
    value: 4.3,
    color: 'var(--chart-cyan)',
  },
  {
    name: 'Firefox',
    value: 3.2,
    color: 'var(--chart-secondary)',
  },
]

const invoices = [
  {
    customer: 'Janet Van Dyne',
    invoice: '23-1215-2',
    dueDate: 'Mar 03, 2023',
    status: 'Paid',
    amount: '$3,234.99',
  },
  {
    customer: 'Acme Corporation',
    invoice: '22-4215-2',
    dueDate: 'Mar 30, 2023',
    status: 'Sent',
    amount: '$1,424.00',
  },
  {
    customer: 'Stark Industries',
    invoice: '23-5315-5',
    dueDate: 'Apr 24, 2023',
    status: 'Sent',
    amount: '$532.36',
  },
  {
    customer: 'Ollivander\'s Wand Shop',
    invoice: '23-1215-6',
    dueDate: 'Mar 10, 2023',
    status: 'Partially Paid',
    amount: '$2,415.64',
  },
  {
    customer: 'Gekko & Company',
    invoice: '22-5624-1',
    dueDate: 'Feb 12, 2023',
    status: 'Overdue',
    amount: '$1,532.00',
  },
  {
    customer: 'Wayne Enterprises',
    invoice: '23-2533-2',
    dueDate: 'Jan 31, 2023',
    status: 'Overdue',
    amount: '$643.47',
  },
  {
    customer: 'Cyberdyne Systems',
    invoice: '23-6752-2',
    dueDate: 'Mar 03, 2023',
    status: 'Partially Paid',
    amount: '$99.00',
  },
  {
    customer: 'The New York Inquirer',
    invoice: '22-8533-2',
    dueDate: 'Apr 30, 2023',
    status: 'Sent',
    amount: '$1,532.00',
  },
  {
    customer: 'Olivia Pope & Associates',
    invoice: '23-9853-3',
    dueDate: 'Apr 09, 2023',
    status: 'Sent',
    amount: '$3,234.99',
  },
]

function getScale(options: ChartScale) {
  return {
    width: options.width ?? 100,
    height: options.height ?? 100,
    padX: options.padX ?? 4,
    padTop: options.padTop ?? 8,
    padBottom: options.padBottom ?? 14,
    min: options.min,
    max: options.max,
  }
}

function chartPoints(values: number[], options: ChartScale): Point[] {
  const scale = getScale(options)
  const diff = scale.max - scale.min || 1
  const chartHeight = scale.height - scale.padTop - scale.padBottom

  return values.map((value, index) => {
    const x = scale.padX + (index / (values.length - 1)) * (scale.width - scale.padX * 2)
    const y = scale.padTop + ((scale.max - value) / diff) * chartHeight

    return { x, y }
  })
}

function smoothPath(values: number[], options: ChartScale) {
  const points = chartPoints(values, options)

  if (points.length < 2)
    return ''

  let d = `M ${points[0].x},${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }

  return d
}

function smoothAreaPath(values: number[], options: ChartScale) {
  const scale = getScale(options)
  const points = chartPoints(values, options)

  if (points.length < 2)
    return ''

  const first = points[0]
  const last = points[points.length - 1]
  const baseY = scale.height - scale.padBottom

  return `
    ${smoothPath(values, options)}
    L ${last.x},${baseY}
    L ${first.x},${baseY}
    Z
  `
}

function statusClass(status: string) {
  switch (status) {
    case 'Paid':
      return 'border-emerald-200 bg-emerald-100 text-emerald-700'
    case 'Sent':
      return 'border-blue-200 bg-blue-100 text-blue-700'
    case 'Partially Paid':
      return 'border-amber-200 bg-amber-100 text-amber-700'
    case 'Overdue':
      return 'border-rose-200 bg-rose-100 text-rose-700'
    default:
      return 'border-border bg-muted text-muted-foreground'
  }
}

const subscriberScale = {
  min: 0,
  max: 17000,
  padX: 4,
  padTop: 7,
  padBottom: 15,
}
</script>

<template>
  <div class="subscribers-dashboard w-full flex flex-col gap-4">
  <!-- <div class="w-full flex flex-col gap-4"> -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-2xl font-bold tracking-tight">
        Inventory
      </h2>
      <div class="flex items-center space-x-2">
        <BaseDateRangePicker />
        <!-- <Button>Download</Button> -->
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="stat-grid">
      <Card
        v-for="item in statCards"
        :key="item.title"
        class="rounded-2xl border border-border/80 shadow-sm"
      >
        <CardContent class="stat-card-content">
          <Icon :name="item.icon" class="mb-2 size-4 text-muted-foreground" />

          <div class="text-sm text-muted-foreground">
            {{ item.title }}
          </div>

          <div class="mt-2 text-2xl font-bold leading-none">
            {{ item.value }}
          </div>

          <div class="mt-3 flex items-center gap-2 text-sm">
            <span
              :class="item.positive ? 'text-[var(--chart-primary)]' : 'text-[var(--chart-accent)]'"
              class="font-medium"
            >
              {{ item.change }}
            </span>
            <span class="text-muted-foreground">·</span>
            <span class="text-muted-foreground">{{ item.note }}</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Charts -->
    <div class="chart-grid">
      <!-- New Subscribers Line Chart -->
      <Card class="rounded-2xl border border-border/80 shadow-sm">
        <CardHeader class="pb-2">
          <div class="flex items-center gap-2 text-muted-foreground">
            <Icon name="i-lucide-user-plus" class="size-4" />
            <CardTitle class="text-lg font-medium">
              New Subscribers
            </CardTitle>
          </div>

          <div class="text-3xl font-bold leading-none">
            42,243
          </div>
        </CardHeader>

        <CardContent class="pb-5">
          <div class="line-chart-box">
            <div class="line-y-axis">
              <span>$14k</span>
              <span>$12k</span>
              <span>$10k</span>
              <span>$8k</span>
              <span>$6k</span>
              <span>$4k</span>
              <span>$2k</span>
              <span>$0</span>
            </div>

            <div class="line-chart-area">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                class="chart-svg"
              >
                <defs>
                  <linearGradient id="subscriberArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--chart-info)" stop-opacity="0.28" />
                    <stop offset="100%" stop-color="var(--chart-info)" stop-opacity="0.02" />
                  </linearGradient>
                </defs>

                <path
                  :d="smoothAreaPath(subscriberValues, subscriberScale)"
                  fill="url(#subscriberArea)"
                />
                <path
                  :d="smoothPath(subscriberValues, subscriberScale)"
                  fill="none"
                  stroke="var(--chart-info)"
                  stroke-width="1.55"
                  vector-effect="non-scaling-stroke"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div class="line-x-axis">
              <span>18 Oct, 2025</span>
              <span>28 Oct, 2025</span>
              <span>7 Nov, 2025</span>
              <span>17 Nov, 2025</span>
              <span>27 Nov, 2025</span>
              <span>7 Dec, 2025</span>
              <span>17 Dec, 2025</span>
            </div>

            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-dot bg-[var(--chart-info)]" />
                Value
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Browser Donut -->
      <Card class="rounded-2xl border border-border/80 shadow-sm">
        <CardHeader class="pb-2">
          <div class="flex items-center gap-2 text-muted-foreground">
            <Icon name="i-lucide-user-plus" class="size-4" />
            <CardTitle class="text-lg font-medium">
              New Subscribers
            </CardTitle>
          </div>

          <div class="text-3xl font-bold leading-none">
            42,243
          </div>
        </CardHeader>

        <CardContent class="pb-5">
          <div class="browser-card-body">
            <div class="donut-wrapper">
              <div class="donut-chart">
                <div class="donut-hole">
                  Browser
                </div>
              </div>
            </div>

            <div class="browser-list">
              <div
                v-for="item in browserStats"
                :key="item.name"
                class="browser-item"
              >
                <div
                  class="browser-color"
                  :style="{ backgroundColor: item.color }"
                />

                <div class="browser-name">
                  <div class="text-sm font-medium">
                    {{ item.name }}
                  </div>
                  <div class="text-xs text-muted-foreground">
                    Browser
                  </div>
                </div>

                <div class="browser-percent">
                  {{ item.value }}%
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline" class="mt-4 h-9 w-full rounded-lg">
            More Details
            <Icon name="i-lucide-chevron-right" class="ml-2 size-4" />
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- Invoice Table -->
    <Card class="rounded-2xl border border-border/80 shadow-sm">
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[950px] text-sm">
            <thead>
              <tr class="border-b text-left text-muted-foreground">
                <th class="w-12 px-5 py-4">
                  <input type="checkbox" class="size-4 rounded border-border">
                </th>
                <th class="px-5 py-4 font-medium">
                  Customer
                </th>
                <th class="px-5 py-4 font-medium">
                  Invoice Number
                </th>
                <th class="px-5 py-4 font-medium">
                  Due date
                </th>
                <th class="px-5 py-4 font-medium">
                  Status
                </th>
                <th class="px-5 py-4 font-medium">
                  Amount
                </th>
                <th class="px-5 py-4 text-center font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="invoice in invoices"
                :key="invoice.invoice"
                class="border-b last:border-b-0"
              >
                <td class="px-5 py-4">
                  <input type="checkbox" class="size-4 rounded border-border">
                </td>
                <td class="px-5 py-4 font-medium">
                  {{ invoice.customer }}
                </td>
                <td class="px-5 py-4">
                  {{ invoice.invoice }}
                </td>
                <td class="px-5 py-4">
                  {{ invoice.dueDate }}
                </td>
                <td class="px-5 py-4">
                  <Badge
                    variant="outline"
                    class="rounded-md px-2 py-0.5 text-xs font-medium"
                    :class="statusClass(invoice.status)"
                  >
                    {{ invoice.status }}
                  </Badge>
                </td>
                <td class="px-5 py-4 font-medium">
                  {{ invoice.amount }}
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-center gap-3">
                    <Button variant="ghost" size="icon" class="size-8">
                      <Icon name="i-lucide-download" class="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" class="size-8">
                      <Icon name="i-lucide-trash-2" class="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4 text-sm text-muted-foreground">
          <div>
            0 of 9 row(s) selected.
          </div>

          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <span>Rows per page</span>
              <Button variant="outline" class="h-8 gap-2 rounded-lg">
                15
                <Icon name="i-lucide-chevron-down" class="size-4" />
              </Button>
            </div>

            <div class="text-foreground">
              Page 1 of 1
            </div>

            <div class="flex items-center gap-1">
              <Button variant="outline" size="icon" class="size-8 rounded-lg" disabled>
                <Icon name="i-lucide-chevrons-left" class="size-4" />
              </Button>
              <Button variant="outline" size="icon" class="size-8 rounded-lg" disabled>
                <Icon name="i-lucide-chevron-left" class="size-4" />
              </Button>
              <Button variant="outline" size="icon" class="size-8 rounded-lg" disabled>
                <Icon name="i-lucide-chevron-right" class="size-4" />
              </Button>
              <Button variant="outline" size="icon" class="size-8 rounded-lg" disabled>
                <Icon name="i-lucide-chevrons-right" class="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
.subscribers-dashboard {
  --chart-primary: var(--primary);
  --chart-info: color-mix(in oklab, var(--primary) 55%, #6366f1);
  --chart-secondary: color-mix(in oklab, var(--primary) 50%, #f97316);
  --chart-cyan: color-mix(in oklab, var(--primary) 45%, #06b6d4);
  --chart-accent: color-mix(in oklab, var(--primary) 50%, #f43f5e);

}

.top-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.range-tabs {
  display: flex;
  padding: 4px;
  border-radius: 8px;
  background: color-mix(in oklab, var(--muted) 70%, transparent);
}

.range-button {
  height: 32px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted-foreground);
  transition: 0.15s ease;
}

.range-button.active {
  color: var(--foreground);
  background: var(--background);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.stat-card-content {
  height: 120px;
  padding: 20px;
}

.chart-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 390px;
  gap: 20px;
}

.line-chart-box {
  position: relative;
  height: 260px;
}

.line-y-axis {
  position: absolute;
  left: 0;
  top: 32px;
  z-index: 0;
  display: flex;
  width: 48px;
  height: 185px;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 12px;
  text-align: right;
  font-size: 12px;
  color: var(--muted-foreground);
}

.line-chart-area {
  position: absolute;
  left: 48px;
  right: 0;
  top: 32px;
  height: 185px;
}

.chart-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.line-x-axis {
  position: absolute;
  left: 48px;
  right: 0;
  bottom: 28px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted-foreground);
}

.chart-legend {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: var(--muted-foreground);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
}

.browser-card-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 150px;
  align-items: center;
  gap: 16px;
  min-height: 260px;
}

.donut-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-chart {
  position: relative;
  width: 210px;
  height: 210px;
  border-radius: 9999px;
  background:
    conic-gradient(
      var(--chart-info) 0deg 234deg,
      transparent 234deg 244deg,
      var(--chart-primary) 244deg 311deg,
      transparent 311deg 321deg,
      var(--chart-cyan) 321deg 336deg,
      transparent 336deg 346deg,
      var(--chart-secondary) 346deg 358deg,
      transparent 358deg 360deg
    );
}

.donut-hole {
  position: absolute;
  inset: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(--background);
  font-size: 14px;
  font-weight: 500;
}

.browser-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.browser-item {
  display: grid;
  grid-template-columns: 4px minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px;
}

.browser-color {
  width: 4px;
  height: 32px;
  border-radius: 9999px;
}

.browser-name {
  min-width: 0;
}

.browser-percent {
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
}

@media (max-width: 1280px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .browser-card-body {
    grid-template-columns: 1fr;
  }

  .browser-list {
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
  }
}

@media (max-width: 640px) {
  .subscribers-dashboard {
    padding: 16px;
  }

  .top-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .action-buttons {
    justify-content: flex-end;
  }

  .stat-grid {
    grid-template-columns: 1fr;
  }

  .line-x-axis {
    font-size: 10px;
  }
}
</style>