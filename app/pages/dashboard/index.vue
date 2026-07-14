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

const kpiCards = [
  {
    title: 'Total Revenue',
    value: '$124.8k',
    percent: 75,
    color: 'var(--chart-primary)',
  },
  {
    title: 'New Users',
    value: '1,245',
    percent: 60,
    color: 'var(--chart-secondary)',
  },
  {
    title: 'Active Subscriptions',
    value: '3,200',
    percent: 90,
    color: 'var(--chart-primary)',
  },
  {
    title: 'Support Tickets',
    value: '27',
    percent: 40,
    color: 'var(--chart-accent)',
  },
]

const webConversions = [
  150, 145, 143, 146, 151, 156, 160, 148, 146, 143,
  147, 151, 155, 159, 148, 146, 144, 148, 152, 156,
  161, 149, 147, 145, 148, 152, 157, 162, 150, 148,
]

const webBounceRate = [
  45, 43, 44, 45, 46, 44, 43, 44, 45, 44,
  43, 44, 45, 46, 44, 43, 44, 45, 44, 43,
  44, 45, 46, 44, 43, 44, 45, 46, 44, 43,
]

const appBars = [
  [240, 130], [115, 75], [110, 70], [140, 72], [180, 100], [250, 155],
  [300, 205], [170, 130], [140, 85], [130, 80], [180, 105], [290, 170],
  [310, 220], [230, 130], [160, 95], [155, 82], [155, 85], [240, 110],
  [325, 210], [230, 225], [165, 130], [155, 90], [140, 82], [170, 95],
  [295, 180], [325, 220], [165, 95],
]

const revenueCurrent = [
  2500, 1500, 3000, 4200, 4700, 2700,
  3300, 3800, 2100, 4200, 2300, 1800,
]

const revenueLastYear = [
  1800, 1200, 2800, 3900, 4300, 2400,
  3100, 3600, 1800, 3900, 2100, 1600,
]

const trafficOrganic = [
  120, 220, 330, 450, 390, 520, 360,
]

const trafficPaid = [
  40, 75, 120, 180, 150, 200, 120,
]

const trafficSocial = [
  25, 55, 110, 135, 100, 140, 80,
]

const trafficDirect = [
  80, 140, 210, 190, 260, 210, 160,
]

const performanceBars = [
  185, 305, 238, 72, 208, 212,
  190, 220, 175, 260, 230, 250,
]

const horizontalBars = [
  { month: 'April', desktop: 72, mobile: 58 },
  { month: 'March', desktop: 118, mobile: 60 },
  { month: 'February', desktop: 150, mobile: 100 },
  { month: 'January', desktop: 92, mobile: 40 },
]

const systemUsage = [
  45, 38, 52, 47, 78, 70, 65, 72, 82, 69, 58, 42, 40,
]

function getScale(options: ChartScale) {
  return {
    width: options.width ?? 100,
    height: options.height ?? 100,
    padX: options.padX ?? 6,
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

function stepPoints(values: number[], options: ChartScale) {
  const points = chartPoints(values, options)
  const result: string[] = []

  points.forEach((point, index) => {
    if (index === 0) {
      result.push(`${point.x},${point.y}`)
    }
    else {
      const prev = points[index - 1]
      result.push(`${point.x},${prev.y}`)
      result.push(`${point.x},${point.y}`)
    }
  })

  return result.join(' ')
}

function barHeight(value: number, max: number, height = 180) {
  return `${(value / max) * height}px`
}

const webScale = {
  min: 0,
  max: 180,
  padX: 5,
  padTop: 9,
  padBottom: 18,
}

const revenueScale = {
  min: 0,
  max: 5000,
  padX: 5,
  padTop: 8,
  padBottom: 18,
}

const trafficScale = {
  min: 0,
  max: 600,
  padX: 5,
  padTop: 8,
  padBottom: 18,
}

const systemScale = {
  min: 0,
  max: 90,
  padX: 5,
  padTop: 8,
  padBottom: 16,
}
</script>

<template>
  <div class="dashboard-theme w-full flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-2xl font-bold tracking-tight">
        Dashboard
      </h2>
      <div class="flex items-center space-x-2">
        <BaseDateRangePicker />
        <!-- <Button>Download</Button> -->
      </div>
    </div>
    <!-- KPI Cards -->
    <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card
        v-for="item in kpiCards"
        :key="item.title"
        class="rounded-2xl border border-border/80 shadow-sm"
      >
        <CardContent class="flex h-[92px] items-center gap-5 px-6 py-4">
          <div class="relative size-[54px]">
            <svg viewBox="0 0 36 36" class="size-[54px] -rotate-90">
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
                :stroke="item.color"
                stroke-width="4"
                stroke-linecap="round"
                :stroke-dasharray="`${item.percent} 100`"
              />
            </svg>

            <div class="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {{ item.percent }}%
            </div>
          </div>

          <div>
            <div class="text-2xl font-bold leading-none">
              {{ item.value }}
            </div>
            <div class="mt-1 text-sm text-muted-foreground">
              {{ item.title }}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Row 1 -->
    <div class="grid gap-5 xl:grid-cols-2">
      <!-- Web Performance -->
      <Card class="rounded-2xl border border-border/80 shadow-sm">
        <CardHeader class="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle class="text-lg font-bold">
              Web Performance
            </CardTitle>
            <CardDescription>Last 6 Months</CardDescription>
          </div>

          <Button variant="ghost" size="icon" class="size-9 rounded-lg bg-muted/60">
            <Icon name="i-lucide-settings" class="size-4" />
          </Button>
        </CardHeader>

        <CardContent class="pb-5">
          <div class="relative h-[245px]">
            <div class="absolute left-0 top-7 z-0 flex h-[178px] w-10 flex-col justify-between pr-3 text-right text-xs text-muted-foreground">
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>

            <div class="absolute left-10 right-0 top-7 h-[178px]">
              <div class="absolute inset-0 grid grid-rows-3">
                <div class="border-b" />
                <div class="border-b" />
                <div class="border-b" />
              </div>

              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                class="absolute inset-0 h-full w-full"
              >
                <defs>
                  <linearGradient id="webOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--chart-secondary)" stop-opacity="0.42" />
                    <stop offset="100%" stop-color="var(--chart-secondary)" stop-opacity="0.02" />
                  </linearGradient>
                  <linearGradient id="webGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--chart-tertiary)" stop-opacity="0.45" />
                    <stop offset="100%" stop-color="var(--chart-tertiary)" stop-opacity="0.02" />
                  </linearGradient>
                </defs>

                <path
                  :d="smoothAreaPath(webConversions, webScale)"
                  fill="url(#webOrange)"
                />
                <path
                  :d="smoothPath(webConversions, webScale)"
                  fill="none"
                  stroke="var(--chart-secondary)"
                  stroke-width="1.5"
                  vector-effect="non-scaling-stroke"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <path
                  :d="smoothAreaPath(webBounceRate, webScale)"
                  fill="url(#webGreen)"
                />
                <path
                  :d="smoothPath(webBounceRate, webScale)"
                  fill="none"
                  stroke="var(--chart-tertiary)"
                  stroke-width="1.5"
                  vector-effect="non-scaling-stroke"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div class="absolute bottom-7 left-10 right-0 flex justify-between text-xs text-muted-foreground">
              <span>Jan 01</span>
              <span>Jan 06</span>
              <span>Jan 11</span>
              <span>Jan 16</span>
              <span>Jan 21</span>
              <span>Jan 26</span>
            </div>

            <div class="absolute bottom-0 left-0 right-0 flex justify-center gap-7 text-xs text-muted-foreground">
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--chart-secondary)]" />
                Conversions
              </div>
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--chart-tertiary)]" />
                Bounce Rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- App Performance -->
      <Card class="rounded-2xl border border-border/80 shadow-sm">
        <CardHeader class="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle class="text-lg font-bold">
              App Performance
            </CardTitle>
            <CardDescription>Last 6 Months</CardDescription>
          </div>

          <Button variant="ghost" size="icon" class="size-9 rounded-lg bg-muted/60">
            <Icon name="i-lucide-settings" class="size-4" />
          </Button>
        </CardHeader>

        <CardContent class="pb-5">
          <div class="relative h-[245px]">
            <div class="absolute left-0 top-7 z-0 flex h-[178px] w-10 flex-col justify-between pr-3 text-right text-xs text-muted-foreground">
              <span>300</span>
              <span>200</span>
              <span>100</span>
              <span>0</span>
            </div>

            <div class="absolute left-10 right-0 top-7 h-[178px]">
              <div class="absolute inset-0 grid grid-rows-3">
                <div class="border-b" />
                <div class="border-b" />
                <div class="border-b" />
              </div>

              <div class="absolute inset-0 flex items-end gap-2 px-1">
                <div
                  v-for="(bar, index) in appBars"
                  :key="index"
                  class="flex flex-1 items-end justify-center gap-1"
                >
                  <div
                    class="w-1.5 rounded-t bg-[var(--chart-secondary)]"
                    :style="{ height: barHeight(bar[0], 340, 160) }"
                  />
                  <div
                    class="w-1.5 rounded-t bg-[var(--chart-tertiary)]"
                    :style="{ height: barHeight(bar[1], 340, 160) }"
                  />
                </div>
              </div>
            </div>

            <div class="absolute bottom-7 left-10 right-0 flex justify-between text-xs text-muted-foreground">
              <span>Jan 01</span>
              <span>Jan 06</span>
              <span>Jan 11</span>
              <span>Jan 16</span>
              <span>Jan 21</span>
              <span>Jan 26</span>
            </div>

            <div class="absolute bottom-0 left-0 right-0 flex justify-center gap-7 text-xs text-muted-foreground">
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--chart-secondary)]" />
                subscriptions
              </div>
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--chart-tertiary)]" />
                downloads
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Row 2 -->
    <div class="grid gap-5 xl:grid-cols-3">
      <!-- Revenue Trend -->
      <Card class="rounded-2xl border border-border/80 shadow-sm">
        <CardHeader class="pb-2">
          <CardTitle class="text-lg font-bold">
            Revenue Trend
          </CardTitle>
          <CardDescription>Year over Year</CardDescription>
        </CardHeader>

        <CardContent class="pb-5">
          <div class="relative h-[245px]">
            <div class="absolute left-0 top-7 z-0 flex h-[160px] w-12 flex-col justify-between pr-3 text-right text-xs text-muted-foreground">
              <span>$4,000</span>
              <span>$2,000</span>
              <span>$0</span>
            </div>

            <div class="absolute left-12 right-0 top-7 h-[160px]">
              <div class="absolute inset-0 grid grid-rows-2">
                <div class="border-b" />
                <div class="border-b" />
              </div>

              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                class="absolute inset-0 h-full w-full"
              >
                <defs>
                  <linearGradient id="revenueBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--chart-info)" stop-opacity="0.34" />
                    <stop offset="100%" stop-color="var(--chart-info)" stop-opacity="0.03" />
                  </linearGradient>
                </defs>

                <path
                  :d="smoothAreaPath(revenueCurrent, revenueScale)"
                  fill="url(#revenueBlue)"
                />
                <path
                  :d="smoothPath(revenueLastYear, revenueScale)"
                  fill="none"
                  stroke="var(--chart-muted)"
                  stroke-width="1.4"
                  vector-effect="non-scaling-stroke"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  :d="smoothPath(revenueCurrent, revenueScale)"
                  fill="none"
                  stroke="var(--chart-info)"
                  stroke-width="1.5"
                  vector-effect="non-scaling-stroke"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div class="absolute bottom-7 left-12 right-0 flex justify-between text-xs text-muted-foreground">
              <span>Jan</span>
              <span>Jun</span>
              <span>Nov</span>
            </div>

            <div class="absolute bottom-0 left-0 right-0 flex justify-center gap-7 text-xs text-muted-foreground">
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--chart-info)]" />
                Current Year
              </div>
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--chart-muted)]" />
                Last Year
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Traffic Analytics -->
      <Card class="rounded-2xl border border-border/80 shadow-sm">
        <CardHeader class="pb-2">
          <CardTitle class="text-lg font-bold">
            Traffic Analytics
          </CardTitle>
          <CardDescription>Last Hours</CardDescription>
        </CardHeader>

        <CardContent class="pb-5">
          <div class="relative h-[245px]">
            <div class="absolute left-0 top-7 z-0 flex h-[160px] w-10 flex-col justify-between pr-3 text-right text-xs text-muted-foreground">
              <span>400</span>
              <span>200</span>
              <span>0</span>
            </div>

            <div class="absolute left-10 right-0 top-7 h-[160px]">
              <div class="absolute inset-0 grid grid-rows-3">
                <div class="border-b" />
                <div class="border-b" />
                <div class="border-b" />
              </div>

              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                class="absolute inset-0 h-full w-full"
              >
                <defs>
                  <linearGradient id="trafficPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--chart-primary)" stop-opacity="0.34" />
                    <stop offset="100%" stop-color="var(--chart-primary)" stop-opacity="0.03" />
                  </linearGradient>
                  <linearGradient id="trafficSecondary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--chart-secondary)" stop-opacity="0.18" />
                    <stop offset="100%" stop-color="var(--chart-secondary)" stop-opacity="0.02" />
                  </linearGradient>
                  <linearGradient id="trafficPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--chart-purple)" stop-opacity="0.18" />
                    <stop offset="100%" stop-color="var(--chart-purple)" stop-opacity="0.02" />
                  </linearGradient>
                </defs>

                <path
                  :d="smoothAreaPath(trafficOrganic, trafficScale)"
                  fill="url(#trafficPrimary)"
                />
                <path
                  :d="smoothAreaPath(trafficDirect, trafficScale)"
                  fill="url(#trafficSecondary)"
                />
                <path
                  :d="smoothAreaPath(trafficSocial, trafficScale)"
                  fill="url(#trafficPurple)"
                />

                <path
                  :d="smoothPath(trafficOrganic, trafficScale)"
                  fill="none"
                  stroke="var(--chart-primary)"
                  stroke-width="1.5"
                  vector-effect="non-scaling-stroke"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  :d="smoothPath(trafficPaid, trafficScale)"
                  fill="none"
                  stroke="var(--chart-info)"
                  stroke-width="1.3"
                  vector-effect="non-scaling-stroke"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  :d="smoothPath(trafficSocial, trafficScale)"
                  fill="none"
                  stroke="var(--chart-purple)"
                  stroke-width="1.3"
                  vector-effect="non-scaling-stroke"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  :d="smoothPath(trafficDirect, trafficScale)"
                  fill="none"
                  stroke="var(--chart-secondary)"
                  stroke-width="1.3"
                  vector-effect="non-scaling-stroke"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div class="absolute bottom-7 left-10 right-0 flex justify-between text-xs text-muted-foreground">
              <span>06:00</span>
              <span>09:00</span>
              <span>12:00</span>
              <span>15:00</span>
              <span>18:00</span>
              <span>21:00</span>
            </div>

            <div class="absolute bottom-0 left-0 right-0 flex justify-center gap-4 text-xs text-muted-foreground">
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--chart-primary)]" />
                Organic
              </div>
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--chart-info)]" />
                Paid
              </div>
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--chart-purple)]" />
                Social
              </div>
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--chart-secondary)]" />
                Direct
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Performance Metrics -->
      <Card class="rounded-2xl border border-border/80 shadow-sm">
        <CardHeader class="pb-2">
          <CardTitle class="text-lg font-bold">
            Performance Metrics
          </CardTitle>
          <CardDescription>Last 6 Months</CardDescription>
        </CardHeader>

        <CardContent class="pb-5">
          <div class="relative h-[245px]">
            <div class="absolute left-0 top-7 z-0 flex h-[160px] w-10 flex-col justify-between pr-3 text-right text-xs text-muted-foreground">
              <span>300</span>
              <span>200</span>
              <span>100</span>
              <span>0</span>
            </div>

            <div class="absolute left-10 right-0 top-7 h-[160px]">
              <div class="absolute inset-0 grid grid-rows-3">
                <div class="border-b" />
                <div class="border-b" />
                <div class="border-b" />
              </div>

              <div class="absolute inset-0 flex items-end gap-4 px-1">
                <div
                  v-for="(bar, index) in performanceBars"
                  :key="index"
                  class="flex flex-1 justify-center"
                >
                  <div
                    class="w-5 rounded-t bg-[var(--chart-primary)]"
                    :style="{ height: barHeight(bar, 320, 150) }"
                  />
                </div>
              </div>
            </div>

            <div class="absolute bottom-7 left-10 right-0 flex justify-between text-xs text-muted-foreground">
              <span>January</span>
              <span>March</span>
              <span>May</span>
              <span>July</span>
              <span>September</span>
              <span>November</span>
            </div>

            <div class="absolute bottom-0 left-0 right-0 flex justify-center text-xs text-muted-foreground">
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--chart-primary)]" />
                Desktop
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Row 3 -->
    <div class="grid gap-5 xl:grid-cols-2">
      <!-- Horizontal Traffic -->
      <Card class="rounded-2xl border border-border/80 shadow-sm">
        <CardHeader class="pb-2">
          <CardTitle class="text-lg font-bold">
            Traffic Analytics
          </CardTitle>
          <CardDescription>Per Month</CardDescription>
        </CardHeader>

        <CardContent class="pb-5">
          <div class="relative h-[245px]">
            <div class="absolute left-16 right-0 top-7 h-[150px]">
              <div class="absolute inset-0 grid grid-cols-5">
                <div class="border-r" />
                <div class="border-r" />
                <div class="border-r" />
                <div class="border-r" />
                <div class="border-r" />
              </div>

              <div class="absolute inset-0 flex flex-col justify-between py-2">
                <div
                  v-for="item in horizontalBars"
                  :key="item.month"
                  class="grid grid-cols-[70px_1fr] items-center gap-3"
                >
                  <div class="-ml-16 text-right text-sm text-muted-foreground">
                    {{ item.month }}
                  </div>

                  <div class="flex h-6 overflow-hidden rounded-sm bg-transparent">
                    <div
                      class="bg-[var(--chart-info)]"
                      :style="{ width: `${item.desktop}%` }"
                    />
                    <div
                      class="bg-[var(--chart-primary)]"
                      :style="{ width: `${item.mobile}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="absolute bottom-7 left-16 right-0 flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>100</span>
              <span>200</span>
              <span>300</span>
              <span>400</span>
              <span>500</span>
            </div>

            <div class="absolute bottom-0 left-0 right-0 flex justify-center gap-7 text-xs text-muted-foreground">
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--chart-info)]" />
                Desktop
              </div>
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--chart-primary)]" />
                Mobile
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- System Performance -->
      <Card class="rounded-2xl border border-border/80 shadow-sm">
        <CardHeader class="pb-2">
          <CardTitle class="text-lg font-bold">
            System Performance
          </CardTitle>
          <CardDescription>Last 24 hours</CardDescription>
        </CardHeader>

        <CardContent class="pb-5">
          <div class="relative h-[245px]">
            <div class="absolute left-0 top-7 z-0 flex h-[160px] w-10 flex-col justify-between pr-3 text-right text-xs text-muted-foreground">
              <span>80%</span>
              <span>60%</span>
              <span>40%</span>
              <span>20%</span>
              <span>0%</span>
            </div>

            <div class="absolute left-10 right-0 top-7 h-[160px]">
              <div class="absolute inset-0 grid grid-cols-6">
                <div class="border-r" />
                <div class="border-r" />
                <div class="border-r" />
                <div class="border-r" />
                <div class="border-r" />
                <div />
              </div>
              <div class="absolute inset-0 grid grid-rows-4">
                <div class="border-b" />
                <div class="border-b" />
                <div class="border-b" />
                <div />
              </div>

              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                class="absolute inset-0 h-full w-full"
              >
                <polyline
                  :points="stepPoints(systemUsage, systemScale)"
                  fill="none"
                  stroke="var(--chart-secondary)"
                  stroke-width="1.5"
                  vector-effect="non-scaling-stroke"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
              </svg>
            </div>

            <div class="absolute bottom-7 left-10 right-0 flex justify-between text-xs text-muted-foreground">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>24:00</span>
            </div>

            <div class="absolute bottom-0 left-0 right-0 flex justify-center text-xs text-muted-foreground">
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-[var(--chart-secondary)]" />
                CPU Usage
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.dashboard-theme {
  --chart-primary: var(--primary);
  --chart-secondary: color-mix(in oklab, var(--primary) 55%, #f97316);
  --chart-tertiary: color-mix(in oklab, var(--primary) 50%, #84cc16);
  --chart-accent: color-mix(in oklab, var(--primary) 50%, #f43f5e);
  --chart-info: color-mix(in oklab, var(--primary) 55%, #6366f1);
  --chart-purple: color-mix(in oklab, var(--primary) 50%, #8b5cf6);
  --chart-muted: color-mix(in oklab, var(--muted-foreground) 65%, transparent);
}
</style>