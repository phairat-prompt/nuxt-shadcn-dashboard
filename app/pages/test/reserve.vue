<script setup lang="ts">
import { computed } from 'vue'

type SupplyItem = {
  key: string
  title: string
  subtitle: string
  volume: number
  days: number
  icon: string
  tone: 'primary' | 'success' | 'warning' | 'danger'
}


const referenceDate = '21 เมษายน 2569'
const updatedAt = '09:30 น.'

const supplyItems: SupplyItem[] = [
  {
    key: 'secured',
    title: 'น้ำมันที่ยืนยันการจัดหาแล้ว',
    subtitle: 'รอการขนส่ง',
    volume: 2939,
    days: 23,
    icon: 'i-lucide-package-check',
    tone: 'primary',
  },
  {
    key: 'shipping',
    title: 'น้ำมันอยู่ระหว่างการขนส่ง',
    subtitle: 'กำลังเดินทางเข้าสู่ประเทศไทย',
    volume: 5007,
    days: 40,
    icon: 'i-lucide-ship',
    tone: 'warning',
  },
  {
    key: 'commercial',
    title: 'น้ำมันสำรองเพื่อการค้า',
    subtitle: 'สำรองสำหรับการดำเนินธุรกิจ',
    volume: 2729,
    days: 26,
    icon: 'i-lucide-database',
    tone: 'success',
  },
  {
    key: 'legal',
    title: 'น้ำมันสำรองตามกฎหมาย',
    subtitle: 'ใช้ในกรณีฉุกเฉินตามกฎหมาย',
    volume: 3354,
    days: 25,
    icon: 'i-lucide-landmark',
    tone: 'danger',
  },
]


const totalDays = computed(() =>
  supplyItems.reduce((sum, item) => sum + item.days, 0),
)

const totalVolume = computed(() =>
  supplyItems.reduce((sum, item) => sum + item.volume, 0),
)

const donutStops = computed(() => {
  let cursor = 0

  const toneColor: Record<SupplyItem['tone'], string> = {
    primary: 'var(--primary)',
    success: 'var(--chart-2, #22c55e)',
    warning: 'var(--chart-3, #f59e0b)',
    danger: 'var(--chart-5, #ef4444)',
  }

  return supplyItems
    .map((item) => {
      const start = cursor
      cursor += (item.volume / totalVolume.value) * 100
      return `${toneColor[item.tone]} ${start}% ${cursor}%`
    })
    .join(', ')
})

const donutBackground = computed(() =>
  `conic-gradient(${donutStops.value})`,
)

function formatNumber(value: number) {
  return value.toLocaleString('en-US')
}

function sharePercent(value: number) {
  if (totalVolume.value <= 0)
    return 0

  return (value / totalVolume.value) * 100
}

function toneClass(tone: SupplyItem['tone']) {
  return {
    primary: 'tone-primary',
    success: 'tone-success',
    warning: 'tone-warning',
    danger: 'tone-danger',
  }[tone]
}
</script>

<template>
  <div class="oil-dashboard w-full min-w-0 space-y-4">
    <!-- Header -->
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <div class="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            สถานการณ์น้ำมันของประเทศไทย
          </Badge>

        </div>

        <h1 class="max-w-5xl text-2xl font-bold tracking-tight sm:text-3xl xl:text-4xl">
          ประเทศไทยมีน้ำมันเพียงพอกับความต้องการใช้
          <span class="text-primary">
            ไม่น้อยกว่า {{ totalDays }} วัน
          </span>
        </h1>

        <p class="mt-2 text-sm text-muted-foreground">
          สรุปปริมาณน้ำมันที่จัดหาแล้ว อยู่ระหว่างการขนส่ง
          และน้ำมันสำรองภายในประเทศ
        </p>
      </div>

      <Card class="min-w-[260px] gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
        <CardContent class="p-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs text-muted-foreground">
                ข้อมูล ณ วันที่
              </p>
              <p class="mt-1 font-semibold">
                {{ referenceDate }}
              </p>
            </div>

            <div class="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon name="i-lucide-calendar-days" size="23" />
            </div>
          </div>

          <Separator class="my-3" />

          <p class="text-xs text-muted-foreground">
            อัปเดตล่าสุด {{ updatedAt }}
          </p>
        </CardContent>
      </Card>
    </header>

    <!-- KPI cards -->
    <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        v-for="item in supplyItems"
        :key="item.key"
        class="group gap-0 overflow-hidden rounded-2xl border-border/80 py-0 shadow-sm"
      >
        <CardContent class="p-4">
          <div class="flex items-start gap-3">
            <div
              class="flex size-12 shrink-0 items-center justify-center rounded-2xl"
              :class="toneClass(item.tone)"
            >
              <Icon :name="item.icon" size="25" />
            </div>

            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium">
                {{ item.title }}
              </p>

              <p class="mt-0.5 text-xs text-muted-foreground">
                {{ item.subtitle }}
              </p>

              <div class="mt-3 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <span class="text-2xl font-bold tabular-nums">
                    {{ formatNumber(item.volume) }}
                  </span>
                  <span class="ml-1 text-xs text-muted-foreground">
                    ล้านลิตร
                  </span>
                </div>

                <Badge variant="secondary" class="text-sm">
                  {{ item.days }} วัน
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- Main area -->
    <section class="min-w-0">
      <!-- Route map -->
      <Card class="min-w-0 gap-0 overflow-hidden rounded-2xl border-border/80 py-0 shadow-sm">
        <CardHeader class="px-4 pb-2 pt-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle class="text-lg">
                แหล่งที่มาน้ำมันดิบและเส้นทางการขนส่ง
              </CardTitle>

              <CardDescription>
                ภาพรวมเส้นทางนำเข้าน้ำมันเข้าสู่ประเทศไทย
              </CardDescription>
            </div>

            <Badge variant="outline">
              4 เส้นทางหลัก
            </Badge>
          </div>
        </CardHeader>

        <CardContent class="px-4 pb-4 pt-0">
          <div class="route-map">
            <div class="map-grid" />

            <div class="continent north-america" />
            <div class="continent south-america" />
            <div class="continent europe" />
            <div class="continent africa" />
            <div class="continent asia" />
            <div class="continent oceania" />

            <div class="thailand-target">
              <span />
            </div>

            <svg
              class="route-lines"
              viewBox="0 0 1000 520"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" class="route-fill-green" />
                </marker>
                <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" class="route-fill-blue" />
                </marker>
                <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" class="route-fill-red" />
                </marker>
                <marker id="arrow-pink" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" class="route-fill-pink" />
                </marker>
              </defs>

              <path
                d="M120 280 C280 280, 360 430, 650 330"
                class="route-path route-green"
                marker-end="url(#arrow-green)"
              />
              <path
                d="M515 230 C565 310, 595 320, 650 330"
                class="route-path route-blue"
                marker-end="url(#arrow-blue)"
              />
              <path
                d="M560 190 C625 205, 580 285, 650 330"
                class="route-path route-red route-dashed"
                marker-end="url(#arrow-red)"
              />
              <path
                d="M860 390 C780 365, 750 345, 650 330"
                class="route-path route-pink"
                marker-end="url(#arrow-pink)"
              />
            </svg>

            <div class="route-tag tag-green">
              America / West Africa
            </div>

            <div class="route-tag tag-blue">
              Bab-Al Mandab
            </div>

            <div class="route-tag tag-red">
              Hormuz
            </div>

            <div class="route-tag tag-pink">
              Far East Asia / Oceania
            </div>

            <div class="map-footer">
              <span class="flex items-center gap-2">
                <Icon name="i-lucide-cylinder" size="17" />
                1 ถัง = 500 ล้านลิตร
              </span>

            </div>
          </div>
        </CardContent>
      </Card>

    </section>

    <!-- Bottom area -->
    <section class="min-w-0">
      <!-- Donut -->
      <Card class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
        <CardHeader class="px-4 pb-2 pt-4">
          <CardTitle class="text-lg">
            สัดส่วนปริมาณน้ำมัน
          </CardTitle>

          <CardDescription>
            ปริมาณรวมจากทุกสถานะ
          </CardDescription>
        </CardHeader>

        <CardContent class="px-4 pb-4 pt-1">
          <div class="donut-section">
            <div
              class="supply-donut"
              :style="{ background: donutBackground }"
            >
              <div class="supply-donut-hole">
                <span class="text-xs text-muted-foreground">
                  รวมทั้งสิ้น
                </span>
                <strong class="text-3xl tabular-nums">
                  {{ formatNumber(totalVolume) }}
                </strong>
                <span class="text-xs text-muted-foreground">
                  ล้านลิตร
                </span>
              </div>
            </div>

            <div class="min-w-0 flex-1 space-y-3">
              <div
                v-for="item in supplyItems"
                :key="item.key"
                class="legend-row"
              >
                <span
                  class="legend-indicator"
                  :class="toneClass(item.tone)"
                />

                <p class="min-w-0 flex-1 truncate text-sm font-medium">
                  {{ item.title }}
                </p>

                <strong class="text-sm tabular-nums">
                  {{ sharePercent(item.volume).toFixed(1) }}%
                </strong>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </section>

  </div>
</template>

<style scoped>
.oil-dashboard :deep([data-slot='card-header']) {
  gap: 0.25rem;
}

.tone-primary {
  background: color-mix(in oklab, var(--primary) 16%, var(--card));
  color: var(--primary);
}

.tone-success {
  background: color-mix(in oklab, var(--chart-2, #22c55e) 16%, var(--card));
  color: var(--chart-2, #22c55e);
}

.tone-warning {
  background: color-mix(in oklab, var(--chart-3, #f59e0b) 16%, var(--card));
  color: var(--chart-3, #f59e0b);
}

.tone-danger {
  background: color-mix(in oklab, var(--chart-5, #ef4444) 16%, var(--card));
  color: var(--chart-5, #ef4444);
}

/* Route map */
.route-map {
  position: relative;
  min-height: 520px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 1rem;
  background:
    radial-gradient(
      circle at 68% 60%,
      color-mix(in oklab, var(--primary) 16%, transparent),
      transparent 18%
    ),
    linear-gradient(
      145deg,
      color-mix(in oklab, var(--muted) 40%, var(--card)),
      var(--card)
    );
}

.map-grid {
  position: absolute;
  inset: 0;
  opacity: 0.25;
  background-image:
    linear-gradient(to right, var(--border) 1px, transparent 1px),
    linear-gradient(to bottom, var(--border) 1px, transparent 1px);
  background-size: 52px 52px;
}

.continent {
  position: absolute;
  opacity: 0.5;
  background:
    color-mix(
      in oklab,
      var(--muted-foreground) 28%,
      var(--muted)
    );
  filter: blur(0.2px);
}

.north-america {
  left: 8%;
  top: 17%;
  width: 22%;
  height: 25%;
  border-radius: 55% 34% 42% 38%;
  transform: rotate(-8deg);
}

.south-america {
  left: 25%;
  top: 48%;
  width: 11%;
  height: 34%;
  border-radius: 55% 45% 70% 35%;
  transform: rotate(-15deg);
}

.europe {
  left: 47%;
  top: 24%;
  width: 10%;
  height: 10%;
  border-radius: 55% 45% 52% 48%;
}

.africa {
  left: 47%;
  top: 37%;
  width: 15%;
  height: 31%;
  border-radius: 50% 45% 65% 38%;
  transform: rotate(4deg);
}

.asia {
  left: 57%;
  top: 19%;
  width: 30%;
  height: 33%;
  border-radius: 55% 45% 55% 40%;
  transform: rotate(3deg);
}

.oceania {
  left: 82%;
  top: 63%;
  width: 10%;
  height: 12%;
  border-radius: 60% 40% 50% 50%;
  transform: rotate(-6deg);
}

.thailand-target {
  position: absolute;
  left: 64.5%;
  top: 57%;
  z-index: 4;
  width: 78px;
  height: 78px;
  transform: translate(-50%, -50%);
  border: 2px solid color-mix(in oklab, var(--primary) 70%, white);
  border-radius: 9999px;
  background:
    color-mix(
      in oklab,
      var(--primary) 12%,
      transparent
    );
  box-shadow:
    0 0 0 10px color-mix(in oklab, var(--primary) 8%, transparent),
    0 0 32px color-mix(in oklab, var(--primary) 30%, transparent);
}

.thailand-target span {
  position: absolute;
  inset: 50%;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);
  border: 3px solid var(--card);
  border-radius: 9999px;
  background: var(--primary);
}

.route-lines {
  position: absolute;
  inset: 0;
  z-index: 3;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.route-path {
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
}

.route-dashed {
  stroke-dasharray: 10 8;
}

.route-green {
  stroke: var(--chart-2, #22c55e);
}

.route-blue {
  stroke: var(--primary);
}

.route-red {
  stroke: var(--chart-5, #ef4444);
}

.route-pink {
  stroke: var(--chart-4, #ec4899);
}

.route-fill-green {
  fill: var(--chart-2, #22c55e);
}

.route-fill-blue {
  fill: var(--primary);
}

.route-fill-red {
  fill: var(--chart-5, #ef4444);
}

.route-fill-pink {
  fill: var(--chart-4, #ec4899);
}

.route-tag {
  position: absolute;
  z-index: 5;
  padding: 0.35rem 0.6rem;
  border: 1px solid currentColor;
  border-radius: 0.5rem;
  background: color-mix(in oklab, var(--card) 88%, transparent);
  font-size: 0.72rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
}

.tag-green {
  left: 11%;
  top: 61%;
  color: var(--chart-2, #22c55e);
}

.tag-blue {
  left: 48%;
  top: 48%;
  color: var(--primary);
}

.tag-red {
  left: 54%;
  top: 31%;
  color: var(--chart-5, #ef4444);
}

.tag-pink {
  right: 8%;
  bottom: 21%;
  color: var(--chart-4, #ec4899);
}

.map-footer {
  position: absolute;
  right: 1rem;
  bottom: 0.8rem;
  left: 1rem;
  z-index: 5;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: color-mix(in oklab, var(--card) 82%, transparent);
  color: var(--muted-foreground);
  font-size: 0.72rem;
  backdrop-filter: blur(10px);
}

/* Donut */
.donut-section {
  display: grid;
  grid-template-columns: minmax(220px, 0.75fr) minmax(280px, 1.25fr);
  align-items: center;
  gap: 1.25rem;
}

.supply-donut {
  position: relative;
  width: min(100%, 280px);
  aspect-ratio: 1;
  margin: 0 auto;
  border-radius: 9999px;
}

.supply-donut-hole {
  position: absolute;
  inset: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: inherit;
  background: var(--card);
  text-align: center;
}

.legend-row {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.7rem;
}

.legend-indicator {
  display: inline-block;
  width: 0.7rem;
  height: 0.7rem;
  flex: 0 0 auto;
  border-radius: 9999px;
}

.legend-indicator.tone-primary {
  background: var(--primary);
}

.legend-indicator.tone-success {
  background: var(--chart-2, #22c55e);
}

.legend-indicator.tone-warning {
  background: var(--chart-3, #f59e0b);
}

.legend-indicator.tone-danger {
  background: var(--chart-5, #ef4444);
}

@media (max-width: 768px) {
  .route-map {
    min-height: 430px;
  }

  .donut-section {
    grid-template-columns: minmax(0, 1fr);
  }

  .supply-donut {
    width: min(100%, 210px);
  }

  .route-tag {
    font-size: 0.62rem;
  }
}
</style>
