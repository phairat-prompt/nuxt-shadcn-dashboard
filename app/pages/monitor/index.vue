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

const summaryCards = [
  {
    value: '418',
    label: 'Running containers',
    trend: 'down',
  },
  {
    value: '32',
    label: 'Terminated containers',
    trend: 'up',
  },
  {
    value: '63',
    label: 'Paused containers',
    trend: 'up',
  },
  {
    value: '98.8%',
    label: 'Average uptime',
    trend: 'down',
  },
]

const cpuImage1 = [43, 54, 70, 62, 59, 88, 57, 76, 84, 68, 47, 64, 63, 87, 80, 51, 78, 43, 51, 62, 57]
const cpuImage2 = [75, 88, 54, 80, 68, 47, 66, 80, 48, 62, 70, 82, 73, 44, 61, 66, 54, 76, 62, 87, 78]
const cpuImage3 = [79, 80, 87, 61, 53, 50, 79, 56, 83, 81, 63, 52, 72, 61, 71]

const requests = [
  52, 55, 54, 56, 58, 60, 63, 61, 65, 67,
  62, 64, 66, 68, 65, 61, 57, 55, 54, 56,
  52, 49, 45, 47, 44, 42, 39, 36, 37, 34,
  36, 31, 30, 31, 33, 36, 39, 38, 37, 36,
  35, 37, 39, 45, 50, 52, 51, 50, 54, 57,
  59, 60, 60, 64, 67, 63, 66, 65, 64, 63,
  61, 59, 57, 54, 51, 48, 45, 43, 39, 35,
  34, 32, 30, 31, 33, 31, 32, 34, 36, 42,
]

const activities = [
  {
    date: 'Actions on Sep 25, 2025',
    items: [
      {
        title: 'Deployment v1.2.3 to production',
        author: 'Dennis Adriaans',
        hash: '742b961',
        icon: 'i-lucide-rocket',
      },
      {
        title: 'Service v1.2.3',
        author: 'Dennis Adriaans',
        hash: '7d0d7bf',
        icon: 'i-lucide-server',
      },
    ],
  },
  {
    date: 'Actions on Sep 24, 2025',
    items: [
      {
        title: 'Pull request #42',
        author: 'Dennis Adriaans',
        hash: 'a3c5f21',
        icon: 'i-lucide-git-pull-request',
      },
      {
        title: 'Hotfix v1.2.2 to staging',
        author: 'Dennis Adriaans',
        hash: 'e8f9a12',
        icon: 'i-lucide-wrench',
      },
    ],
  },
  {
    date: 'Actions on Sep 23, 2025',
    items: [
      {
        title: 'Branch feature/new-dashboard',
        author: 'Dennis Adriaans',
        hash: '2b4d6c8',
        icon: 'i-lucide-git-branch',
      },
    ],
  },
]

function getScale(options: ChartScale) {
  return {
    width: options.width ?? 100,
    height: options.height ?? 100,
    padX: options.padX ?? 4,
    padTop: options.padTop ?? 8,
    padBottom: options.padBottom ?? 12,
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

function linePath(values: number[], options: ChartScale) {
  const points = chartPoints(values, options)

  if (points.length < 2)
    return ''

  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`)
    .join(' ')
}

function barHeight(value: number, max: number, height = 200) {
  return `${(value / max) * height}px`
}

const cpuScale = {
  min: 0,
  max: 100,
  padX: 4,
  padTop: 8,
  padBottom: 16,
}
</script>

<template>
  <div class="container-dashboard w-full flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-2xl font-bold tracking-tight">
        Server Monitor
      </h2>

      <div class="flex items-center space-x-2">
        <BaseDateRangePicker />
      </div>
    </div>

    <div class="grid gap-5 xl:grid-cols-[1fr_380px]">
      <!-- Main Content -->
      <div class="min-w-0 space-y-5">
        <!-- Summary -->
        <Card class="rounded-2xl border border-border/80 shadow-sm">
          <CardContent class="grid gap-6 px-6 py-5 md:grid-cols-4">
            <div
              v-for="item in summaryCards"
              :key="item.label"
              class="space-y-1"
            >
              <div class="flex items-center gap-2">
                <div class="text-3xl font-bold leading-none">
                  {{ item.value }}
                </div>

                <Icon
                  v-if="item.trend === 'up'"
                  name="i-lucide-triangle"
                  class="size-4 fill-[var(--chart-primary)] text-[var(--chart-primary)]"
                />
                <Icon
                  v-else
                  name="i-lucide-triangle"
                  class="size-4 rotate-180 fill-[var(--chart-accent)] text-[var(--chart-accent)]"
                />
              </div>

              <div class="text-sm text-muted-foreground">
                {{ item.label }}
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- CPU Usage -->
        <Card class="rounded-2xl border border-border/80 shadow-sm">
          <CardHeader class="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle class="text-xl font-bold">
                CPU usage by image
              </CardTitle>
            </div>

            <Button variant="outline" class="h-9 gap-2 rounded-lg">
              Tomorrow
              <Icon name="i-lucide-chevron-down" class="size-4" />
            </Button>
          </CardHeader>

          <CardContent class="pb-5">
            <div class="relative h-[300px]">
              <div class="absolute left-0 top-8 z-0 flex h-[220px] w-10 flex-col justify-between pr-3 text-right text-xs text-muted-foreground">
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>

              <div class="absolute left-10 right-0 top-8 h-[220px]">
                <div class="absolute inset-0 grid grid-rows-4">
                  <div class="border-b" />
                  <div class="border-b" />
                  <div class="border-b" />
                  <div class="border-b" />
                </div>

                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  class="absolute inset-0 h-full w-full"
                >
                  <path
                    :d="linePath(cpuImage1, cpuScale)"
                    fill="none"
                    stroke="var(--chart-info)"
                    stroke-width="1.7"
                    vector-effect="non-scaling-stroke"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    :d="linePath(cpuImage2, cpuScale)"
                    fill="none"
                    stroke="var(--chart-purple)"
                    stroke-width="1.7"
                    vector-effect="non-scaling-stroke"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    :d="linePath(cpuImage3, cpuScale)"
                    fill="none"
                    stroke="var(--chart-cyan)"
                    stroke-width="1.7"
                    vector-effect="non-scaling-stroke"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <div class="absolute bottom-7 left-10 right-0 flex justify-between text-xs text-muted-foreground">
                <span>2 AM</span>
                <span>7 AM</span>
                <span>12 PM</span>
                <span>5 PM</span>
                <span>10 PM</span>
              </div>

              <div class="absolute bottom-0 left-0 right-0 flex justify-center gap-7 text-xs text-muted-foreground">
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-full bg-[var(--chart-info)]" />
                  image_1
                </div>
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-full bg-[var(--chart-purple)]" />
                  image_2
                </div>
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-full bg-[var(--chart-cyan)]" />
                  image_3
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Requests -->
        <Card class="rounded-2xl border border-border/80 shadow-sm">
          <CardHeader class="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle class="text-xl font-bold">
                Requests
              </CardTitle>
            </div>

            <Button variant="outline" class="h-9 gap-2 rounded-lg">
              Tomorrow
              <Icon name="i-lucide-chevron-down" class="size-4" />
            </Button>
          </CardHeader>

          <CardContent class="pb-5">
            <div class="relative h-[300px]">
              <div class="absolute left-0 top-8 z-0 flex h-[220px] w-10 flex-col justify-between pr-3 text-right text-xs text-muted-foreground">
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>

              <div class="absolute left-10 right-0 top-8 h-[220px]">
                <div class="absolute inset-0 grid grid-rows-3">
                  <div class="border-b" />
                  <div class="border-b" />
                  <div class="border-b" />
                </div>

                <div class="absolute inset-0 flex items-end gap-[7px] px-1">
                  <div
                    v-for="(bar, index) in requests"
                    :key="index"
                    class="flex flex-1 justify-center"
                  >
                    <div
                      class="w-[4px] rounded-t bg-[var(--chart-primary)]"
                      :style="{ height: barHeight(bar, 70, 205) }"
                    />
                  </div>
                </div>
              </div>

              <div class="absolute bottom-7 left-10 right-0 flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>20</span>
                <span>40</span>
                <span>60</span>
                <span>80</span>
              </div>

              <div class="absolute bottom-0 left-0 right-0 flex justify-center text-xs text-muted-foreground">
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-full bg-[var(--chart-primary)]" />
                  Total Requests
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Activity -->
      <aside class="xl:sticky xl:top-5 xl:self-start">
        <Card class="rounded-2xl border border-border/80 shadow-sm">
          <CardHeader class="flex flex-row items-center justify-between pb-3">
            <CardTitle class="text-xl font-bold">
              Activity
            </CardTitle>

            <Button variant="outline" class="h-9 gap-2 rounded-lg">
              <Icon name="i-lucide-git-branch" class="size-4" />
              Main branch
              <Icon name="i-lucide-chevron-down" class="size-4" />
            </Button>
          </CardHeader>

          <CardContent class="space-y-6 px-6 pb-6">
            <div
              v-for="group in activities"
              :key="group.date"
              class="space-y-3 border-b pb-5 last:border-b-0 last:pb-0"
            >
              <div class="flex items-center gap-2 text-sm font-medium">
                <Icon name="i-lucide-git-commit-horizontal" class="size-4 text-muted-foreground" />
                {{ group.date }}
              </div>

              <div class="space-y-2">
                <div
                  v-for="item in group.items"
                  :key="item.title"
                  class="flex items-center gap-3 rounded-xl bg-muted/20 px-3 py-3"
                >
                  <div class="activity-avatar">
                    <Icon :name="item.icon" class="size-4" />
                  </div>

                  <div class="min-w-0 flex-1">
                    <div class="truncate text-sm font-semibold">
                      {{ item.title }}
                    </div>
                    <div class="truncate text-sm text-muted-foreground">
                      {{ item.author }}
                    </div>
                  </div>

                  <div class="hidden text-xs text-muted-foreground md:block">
                    {{ item.hash }}
                  </div>

                  <Button variant="ghost" size="icon" class="size-8">
                    <Icon name="i-lucide-copy" class="size-4" />
                  </Button>

                  <Button variant="ghost" size="icon" class="size-8">
                    <Icon name="i-lucide-code-2" class="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.container-dashboard {
  --chart-primary: var(--primary);
  --chart-info: color-mix(in oklab, var(--primary) 55%, #6366f1);
  --chart-purple: color-mix(in oklab, var(--primary) 50%, #a855f7);
  --chart-cyan: color-mix(in oklab, var(--primary) 45%, #06b6d4);
  --chart-accent: color-mix(in oklab, var(--primary) 50%, #f43f5e);
}

.activity-avatar {
  display: flex;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(--chart-primary);
  color: var(--primary-foreground);
}
</style>