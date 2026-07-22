<script setup lang="ts">
import { computed, ref } from 'vue'

type KpiItem = {
  title: string
  value: number
  unit: string
  april: number
  may: number
  icon: string
}

type ArrivalItem = {
  day: number
  volume: number
  source: 'middle-east' | 'other'
}

type OriginItem = {
  name: string
  value: number
  icon: string
  source: 'middle-east' | 'other'
}

type RefineryItem = {
  name: string
  value: number
}

type DaySummary = {
  day: number
  vesselCount: number
  middleEast: number
  other: number
  total: number
}

type RollingCalendarDay = {
  date: Date
  day: number
  monthLabel: string
  weekDayLabel: string
  dateKey: string
  isWeekend: boolean
  summary: DaySummary | null
}

const kpiItems: KpiItem[] = [
  {
    title: 'ปริมาณรวมทั้งหมด',
    value: 43.38,
    unit: 'ล้านบาร์เรล',
    april: 16.63,
    may: 26.75,
    icon: 'i-lucide-droplets',
  },
  {
    title: 'แหล่งตะวันออกกลาง',
    value: 12.00,
    unit: 'ล้านบาร์เรล',
    april: 7.50,
    may: 4.50,
    icon: 'i-lucide-map',
  },
  {
    title: 'แหล่งอื่น ๆ',
    value: 31.38,
    unit: 'ล้านบาร์เรล',
    april: 9.13,
    may: 22.25,
    icon: 'i-lucide-ship',
  },
]

const aprilArrivals: ArrivalItem[] = [
  { day: 18, volume: 0.30, source: 'other' },
  { day: 20, volume: 1.25, source: 'other' },
  { day: 21, volume: 0.65, source: 'other' },
  { day: 23, volume: 1.51, source: 'other' },
  { day: 23, volume: 2.00, source: 'middle-east' },
  { day: 24, volume: 0.31, source: 'other' },
  { day: 24, volume: 2.00, source: 'middle-east' },
  { day: 25, volume: 0.20, source: 'other' },
  { day: 25, volume: 1.50, source: 'middle-east' },
  { day: 26, volume: 0.95, source: 'other' },
  { day: 28, volume: 1.17, source: 'other' },
  { day: 30, volume: 2.79, source: 'other' },
  { day: 30, volume: 2.00, source: 'middle-east' },
]

const mayArrivals: ArrivalItem[] = [
  { day: 1, volume: 1.50, source: 'other' },
  { day: 2, volume: 0.92, source: 'other' },
  { day: 2, volume: 1.00, source: 'middle-east' },
  { day: 3, volume: 0.50, source: 'other' },
  { day: 3, volume: 1.00, source: 'middle-east' },
  { day: 4, volume: 1.35, source: 'other' },
  { day: 6, volume: 1.62, source: 'other' },
  { day: 8, volume: 0.75, source: 'other' },
  { day: 9, volume: 1.17, source: 'other' },
  { day: 10, volume: 1.88, source: 'other' },
  { day: 11, volume: 0.45, source: 'other' },
  { day: 12, volume: 1.20, source: 'other' },
  { day: 14, volume: 0.50, source: 'middle-east' },
  { day: 15, volume: 0.25, source: 'other' },
  { day: 16, volume: 1.49, source: 'other' },
  { day: 17, volume: 0.17, source: 'other' },
  { day: 19, volume: 1.10, source: 'other' },
  { day: 20, volume: 1.45, source: 'other' },
  { day: 21, volume: 0.27, source: 'other' },
  { day: 23, volume: 0.30, source: 'other' },
  { day: 23, volume: 1.00, source: 'middle-east' },
  { day: 24, volume: 0.18, source: 'other' },
  { day: 25, volume: 1.30, source: 'other' },
  { day: 26, volume: 0.78, source: 'other' },
  { day: 26, volume: 1.00, source: 'middle-east' },
  { day: 27, volume: 0.20, source: 'other' },
  { day: 28, volume: 0.59, source: 'other' },
  { day: 29, volume: 1.18, source: 'other' },
  { day: 30, volume: 1.65, source: 'other' },
]

const originItems: OriginItem[] = [
  { name: 'USA', value: 8.19, icon: '🇺🇸', source: 'other' },
  { name: 'UAE', value: 7.50, icon: '🇦🇪', source: 'middle-east' },
  { name: 'Saudi Arabia', value: 4.50, icon: '🇸🇦', source: 'middle-east' },
  { name: 'Malaysia', value: 2.61, icon: '🇲🇾', source: 'other' },
  { name: 'Nigeria', value: 2.60, icon: '🇳🇬', source: 'other' },
  { name: 'Argentina', value: 2.29, icon: '🇦🇷', source: 'other' },
  { name: 'Libya', value: 2.00, icon: '🇱🇾', source: 'other' },
  { name: 'อื่น ๆ', value: 13.69, icon: '🌐', source: 'other' },
]

const refineryItems: RefineryItem[] = [
  { name: 'IRPC', value: 22 },
  { name: 'BCP', value: 19 },
  { name: 'BSRC', value: 18 },
  { name: 'PTT GC', value: 15 },
  { name: 'SPRC', value: 15 },
  { name: 'Thai Oil', value: 11 },
]

function summarizeDays(items: ArrivalItem[]) {
  const map = new Map<number, DaySummary>()

  items.forEach((item) => {
    if (!map.has(item.day)) {
      map.set(item.day, {
        day: item.day,
        vesselCount: 0,
        middleEast: 0,
        other: 0,
        total: 0,
      })
    }

    const day = map.get(item.day)!
    day.vesselCount += 1
    day.total += item.volume

    if (item.source === 'middle-east')
      day.middleEast += item.volume
    else
      day.other += item.volume
  })

  return [...map.values()].sort((a, b) => a.day - b.day)
}

const aprilSummary = computed(() => summarizeDays(aprilArrivals))
const maySummary = computed(() => summarizeDays(mayArrivals))

const thaiMonthShort = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
]

const thaiWeekDayShort = [
  'อา.',
  'จ.',
  'อ.',
  'พ.',
  'พฤ.',
  'ศ.',
  'ส.',
]

const RANGE_DAYS = 35
const DEFAULT_RANGE_START = new Date(2026, 3, 21, 12, 0, 0)

const rangeStart = ref(new Date(DEFAULT_RANGE_START))

function addDays(date: Date, amount: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatThaiDate(date: Date, showYear = true) {
  const day = date.getDate()
  const month = thaiMonthShort[date.getMonth()]
  const year = date.getFullYear() + 543

  return showYear
    ? `${day} ${month} ${year}`
    : `${day} ${month}`
}

const datedArrivals = computed(() => [
  ...aprilArrivals.map(item => ({
    ...item,
    dateKey: formatDateKey(new Date(2026, 3, item.day, 12, 0, 0)),
  })),
  ...mayArrivals.map(item => ({
    ...item,
    dateKey: formatDateKey(new Date(2026, 4, item.day, 12, 0, 0)),
  })),
])

const summaryByDate = computed(() => {
  const map = new Map<string, DaySummary>()

  datedArrivals.value.forEach((item) => {
    if (!map.has(item.dateKey)) {
      map.set(item.dateKey, {
        day: item.day,
        vesselCount: 0,
        middleEast: 0,
        other: 0,
        total: 0,
      })
    }

    const summary = map.get(item.dateKey)!

    summary.vesselCount += 1
    summary.total += item.volume

    if (item.source === 'middle-east')
      summary.middleEast += item.volume
    else
      summary.other += item.volume
  })

  return map
})

const rollingCalendarDays = computed<RollingCalendarDay[]>(() =>
  Array.from({ length: RANGE_DAYS }, (_, index) => {
    const date = addDays(rangeStart.value, index)
    const dateKey = formatDateKey(date)
    const weekDay = date.getDay()

    return {
      date,
      day: date.getDate(),
      monthLabel: thaiMonthShort[date.getMonth()],
      weekDayLabel: thaiWeekDayShort[weekDay],
      dateKey,
      isWeekend: weekDay === 0 || weekDay === 6,
      summary: summaryByDate.value.get(dateKey) ?? null,
    }
  }),
)

const rollingWeekDayLabels = computed(() =>
  Array.from({ length: 7 }, (_, index) => {
    const date = addDays(rangeStart.value, index)
    return thaiWeekDayShort[date.getDay()]
  }),
)

const rangeEnd = computed(() =>
  addDays(rangeStart.value, RANGE_DAYS - 1),
)

const rangeLabel = computed(() =>
  `${formatThaiDate(rangeStart.value)} – ${formatThaiDate(rangeEnd.value)}`,
)

const rangeTotals = computed(() =>
  rollingCalendarDays.value.reduce(
    (totals, day) => {
      if (!day.summary)
        return totals

      totals.vessels += day.summary.vesselCount
      totals.middleEast += day.summary.middleEast
      totals.other += day.summary.other
      totals.volume += day.summary.total

      return totals
    },
    {
      vessels: 0,
      middleEast: 0,
      other: 0,
      volume: 0,
    },
  ),
)

function moveRange(amount: number) {
  rangeStart.value = addDays(rangeStart.value, amount)
}

function resetRange() {
  rangeStart.value = new Date(DEFAULT_RANGE_START)
}

const maxOrigin = computed(() =>
  Math.max(...originItems.map(item => item.value)),
)

const maxRefinery = computed(() =>
  Math.max(...refineryItems.map(item => item.value)),
)

function formatNumber(value: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
</script>

<template>
  <div class="crude-dashboard w-full min-w-0 space-y-3">
    <!-- Date filter -->
    <header class="flex justify-end">
      <div class="shrink-0">
        <BaseDateRangePicker />
      </div>
    </header>

    <!-- KPI -->
    <section class="grid gap-3 md:grid-cols-3">
      <Card
        v-for="item in kpiItems"
        :key="item.title"
        class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm"
      >
        <CardContent class="p-3">
          <div class="kpi-row">
            <!-- Main value -->
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-medium text-muted-foreground">
                {{ item.title }}
              </p>

              <div class="mt-0.5 flex flex-wrap items-baseline gap-x-1.5">
                <span class="text-2xl font-bold tracking-tight tabular-nums">
                  {{ formatNumber(item.value) }}
                </span>

                <span class="text-[11px] font-medium text-muted-foreground">
                  {{ item.unit }}
                </span>
              </div>
            </div>

            <!-- Monthly values -->
            <div class="kpi-months">
              <div class="kpi-month">
                <span>เมษายน</span>

                <strong class="tabular-nums">
                  {{ formatNumber(item.april) }}
                </strong>
              </div>

              <div class="kpi-month">
                <span>พฤษภาคม</span>

                <strong class="tabular-nums text-primary">
                  {{ formatNumber(item.may) }}
                </strong>
              </div>
            </div>

            <!-- Icon -->
            <div
              class="
                flex size-10 shrink-0 items-center justify-center rounded-xl
                bg-primary/10 text-primary
              "
            >
              <Icon :name="item.icon" size="23" />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- Main dashboard -->
    <section
      class="
        grid min-w-0 items-stretch gap-3
        xl:grid-cols-[minmax(320px,1fr)_minmax(0,2.2fr)]
      "
    >
      <!-- Left column: source and refinery charts -->
      <div class="grid min-w-0 gap-3 xl:grid-rows-2">
      <Card class="h-full gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
        <CardHeader class="px-4 pb-3 pt-4">
          <CardTitle class="text-lg">
            ปริมาณน้ำมันดิบแยกตามแหล่งต้นทาง
          </CardTitle>

          <CardDescription>
            ปริมาณรวมตามประเทศต้นทาง
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-3 px-4 pb-4 pt-0">
          <div
            v-for="item in originItems"
            :key="item.name"
            class="origin-row"
          >
            <div class="flex min-w-0 items-center gap-2">
              <span class="text-lg">{{ item.icon }}</span>
              <span class="truncate text-sm font-medium">
                {{ item.name }}
              </span>
            </div>

            <div class="h-3 overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full"
                :class="item.source === 'middle-east'
                  ? 'bg-destructive'
                  : 'bg-primary'"
                :style="{ width: `${(item.value / maxOrigin) * 100}%` }"
              />
            </div>

            <strong class="text-right text-sm tabular-nums">
              {{ formatNumber(item.value) }}
            </strong>
          </div>
        </CardContent>
      </Card>

      <Card class="h-full gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
        <CardHeader class="px-4 pb-3 pt-4">
          <CardTitle class="text-lg">
            สัดส่วนการจัดหาน้ำมันดิบแยกตามรายโรงกลั่น
          </CardTitle>

          <CardDescription>
            คิดเป็นร้อยละของปริมาณรวม
          </CardDescription>
        </CardHeader>

        <CardContent class="px-4 pb-4 pt-0">
          <div class="refinery-chart">
            <div
              v-for="item in refineryItems"
              :key="item.name"
              class="refinery-column"
            >
              <strong class="text-sm tabular-nums">
                {{ item.value }}%
              </strong>

              <div class="refinery-track">
                <div
                  class="refinery-bar"
                  :style="{ height: `${(item.value / maxRefinery) * 100}%` }"
                />
              </div>

              <span class="text-center text-xs font-medium">
                {{ item.name }}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      <!-- Right column: calendar -->
      <Card
          class="
            flex h-full min-w-0 flex-col gap-0 overflow-hidden
            rounded-2xl border-border/80 py-0 shadow-sm
          "
        >
        <CardHeader class="px-4 pb-3 pt-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle class="text-lg">
                ปฏิทินกำหนดการเรือเข้า
              </CardTitle>

              <!-- <CardDescription>
                แสดงต่อเนื่อง 35 วันเต็ม 5 สัปดาห์ โดยไม่จำกัดตามเดือนปฏิทิน
              </CardDescription> -->
            </div>

            <div class="flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                class="size-9"
                title="ย้อนกลับ 35 วัน"
                @click="moveRange(-RANGE_DAYS)"
              >
                <Icon name="i-lucide-chevron-left" size="17" />
              </Button>

              <Button
                variant="outline"
                class="h-9 min-w-[210px] justify-center gap-2 px-3"
                @click="resetRange"
              >
                <Icon name="i-lucide-calendar-days" size="16" />
                {{ rangeLabel }}
              </Button>

              <Button
                variant="outline"
                size="icon"
                class="size-9"
                title="ถัดไป 35 วัน"
                @click="moveRange(RANGE_DAYS)"
              >
                <Icon name="i-lucide-chevron-right" size="17" />
              </Button>
            </div>
          </div>

          <div class="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" class="gap-1">
              <Icon name="i-lucide-ship" size="14" />
              {{ rangeTotals.vessels }} เที่ยว
            </Badge>

            <Badge
              variant="outline"
              class="border-primary/30 bg-primary/10 text-primary"
            >
              แหล่งอื่น ๆ {{ formatNumber(rangeTotals.other) }}
            </Badge>

            <Badge
              variant="outline"
              class="border-destructive/30 bg-destructive/10 text-destructive"
            >
              ตะวันออกกลาง {{ formatNumber(rangeTotals.middleEast) }}
            </Badge>

            <Badge variant="secondary">
              รวม {{ formatNumber(rangeTotals.volume) }} ล้านบาร์เรล
            </Badge>
          </div>
        </CardHeader>

        <CardContent class="min-h-0 flex-1 px-4 pb-4 pt-0">
          <div class="rolling-calendar-scroll">
            <div class="rolling-calendar">
              <div
                v-for="(label, index) in rollingWeekDayLabels"
                :key="`weekday-${index}-${label}`"
                class="rolling-weekday"
              >
                {{ label }}
              </div>

              <article
                v-for="day in rollingCalendarDays"
                :key="day.dateKey"
                class="rolling-day"
                :class="{
                  'rolling-day-weekend': day.isWeekend,
                  'rolling-day-active': day.summary,
                }"
              >
                <header class="rolling-day-header">
                  <div>
                    <p class="text-[11px] font-medium text-muted-foreground">
                      {{ day.weekDayLabel }}
                    </p>

                    <p class="text-sm font-bold">
                      {{ day.day }} {{ day.monthLabel }}
                    </p>
                  </div>

                  <Badge
                    v-if="day.summary"
                    variant="secondary"
                    class="h-5 px-1.5 text-[10px]"
                  >
                    {{ day.summary.vesselCount }} เที่ยว
                  </Badge>
                </header>

                <div
                  v-if="day.summary"
                  class="rolling-day-events"
                >
                  <div
                    v-if="day.summary.other > 0"
                    class="rolling-event rolling-event-other"
                  >
                    <Icon name="i-lucide-ship" size="14" />

                    <div class="min-w-0 flex-1">
                      <p>แหล่งอื่น ๆ</p>
                      <strong class="tabular-nums">
                        {{ formatNumber(day.summary.other) }}
                      </strong>
                    </div>
                  </div>

                  <div
                    v-if="day.summary.middleEast > 0"
                    class="rolling-event rolling-event-middle-east"
                  >
                    <Icon name="i-lucide-ship" size="14" />

                    <div class="min-w-0 flex-1">
                      <p>ตะวันออกกลาง</p>
                      <strong class="tabular-nums">
                        {{ formatNumber(day.summary.middleEast) }}
                      </strong>
                    </div>
                  </div>

                  <div class="rolling-day-total">
                    <span>รวม</span>

                    <strong class="tabular-nums">
                      {{ formatNumber(day.summary.total) }}
                    </strong>
                  </div>
                </div>

                <div
                  v-else
                  class="rolling-day-empty"
                >
                  <Icon name="i-lucide-calendar-x-2" size="17" />
                  <span>ไม่มีแผนเรือเข้า</span>
                </div>
              </article>
            </div>
          </div>

          <div class="calendar-legend">
            <div class="flex items-center gap-2">
              <span class="size-2.5 rounded-full bg-primary" />
              <span>แหล่งอื่น ๆ</span>
            </div>

            <div class="flex items-center gap-2">
              <span class="size-2.5 rounded-full bg-destructive" />
              <span>ตะวันออกกลาง</span>
            </div>

            <div class="flex items-center gap-2 text-muted-foreground">
              <Icon name="i-lucide-info" size="14" />
              <span>หน่วยในแต่ละวัน: ล้านบาร์เรล</span>
            </div>
          </div>
        </CardContent>
      </Card>

    </section>

    <p class="text-right text-xs text-muted-foreground">
      อ้างอิงข้อมูล: 21 เมษายน 2569
    </p>
  </div>
</template>

<style scoped>
.crude-dashboard :deep([data-slot='card-header']) {
  gap: 0.25rem;
}

.crude-dashboard-main-left {
  min-height: 0;
}

.kpi-row {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.75rem;
}

.kpi-months {
  display: grid;
  flex: 0 0 auto;
  grid-template-columns: repeat(2, minmax(72px, auto));
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background:
    color-mix(
      in oklab,
      var(--muted) 20%,
      var(--card)
    );
}

.kpi-month {
  display: flex;
  min-width: 72px;
  flex-direction: column;
  justify-content: center;
  padding: 0.35rem 0.55rem;
  line-height: 1.1;
}

.kpi-month + .kpi-month {
  border-left: 1px solid var(--border);
}

.kpi-month span {
  color: var(--muted-foreground);
  font-size: 0.65rem;
  font-weight: 500;
}

.kpi-month strong {
  margin-top: 0.15rem;
  color: var(--foreground);
  font-size: 0.8rem;
  font-weight: 700;
}

.kpi-month strong.text-primary {
  color: var(--primary);
}

.rolling-calendar-scroll {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.rolling-calendar {
  display: grid;
  min-width: 980px;
  grid-template-columns: repeat(7, minmax(130px, 1fr));
  border-top: 1px solid var(--border);
  border-left: 1px solid var(--border);
  border-radius: 1rem;
  overflow: hidden;
}

.rolling-weekday {
  padding: 0.55rem;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background:
    color-mix(
      in oklab,
      var(--muted) 45%,
      var(--card)
    );
  color: var(--muted-foreground);
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.rolling-day {
  display: flex;
  min-height: 122px;
  flex-direction: column;
  padding: 0.6rem;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--card);
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

.rolling-day-weekend {
  background:
    color-mix(
      in oklab,
      var(--muted) 20%,
      var(--card)
    );
}

.rolling-day-active:hover {
  background:
    color-mix(
      in oklab,
      var(--primary) 5%,
      var(--card)
    );
}

.rolling-day-header {
  display: flex;
  min-height: 32px;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.35rem;
}

.rolling-day-events {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.3rem;
  margin-top: 0.35rem;
}

/* กรณีมีข้อมูลเพียงแหล่งเดียว ให้แสดงเต็มความกว้าง */
.rolling-event:first-child:nth-last-child(2) {
  grid-column: 1 / -1;
}

.rolling-event {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.4rem;
  border: 1px solid transparent;
  border-radius: 0.6rem;
  font-size: 0.66rem;
  line-height: 1.05;
}

.rolling-event p {
  margin: 0;
  overflow: hidden;
  font-size: 0.61rem;
  font-weight: 500;
  line-height: 1.05;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rolling-event strong {
  display: block;
  margin-top: 0.08rem;
  font-size: 0.72rem;
}

.rolling-event-other {
  border-color:
    color-mix(
      in oklab,
      var(--primary) 26%,
      transparent
    );
  background:
    color-mix(
      in oklab,
      var(--primary) 9%,
      var(--card)
    );
  color: var(--primary);
}

.rolling-event-middle-east {
  border-color:
    color-mix(
      in oklab,
      var(--destructive) 26%,
      transparent
    );
  background:
    color-mix(
      in oklab,
      var(--destructive) 9%,
      var(--card)
    );
  color: var(--destructive);
}

.rolling-day-total {
  display: flex;
  grid-column: 1 / -1;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.15rem;
  color: var(--muted-foreground);
  font-size: 0.7rem;
}

.rolling-day-total strong {
  color: var(--foreground);
}

.rolling-day-empty {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: var(--muted-foreground);
  text-align: center;
  font-size: 0.7rem;
}

.calendar-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  margin-top: 0.85rem;
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 0.85rem;
  background:
    color-mix(
      in oklab,
      var(--muted) 20%,
      var(--card)
    );
  font-size: 0.75rem;
}

.origin-row {
  display: grid;
  grid-template-columns: minmax(105px, 0.9fr) minmax(90px, 1.8fr) 52px;
  align-items: center;
  gap: 0.75rem;
}

.refinery-chart {
  display: grid;
  grid-template-columns: repeat(6, minmax(60px, 1fr));
  align-items: end;
  gap: clamp(0.6rem, 2vw, 1.25rem);
  min-height: 245px;
  padding-top: 0.5rem;
}

.refinery-column {
  display: flex;
  min-width: 0;
  align-items: center;
  flex-direction: column;
  gap: 0.45rem;
}

.refinery-track {
  display: flex;
  width: clamp(38px, 4vw, 58px);
  height: 165px;
  align-items: flex-end;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 0.75rem 0.75rem 0 0;
  background:
    repeating-linear-gradient(
      to top,
      var(--muted) 0,
      var(--muted) 1px,
      transparent 1px,
      transparent 41px
    );
}

.refinery-bar {
  width: 100%;
  min-height: 2px;
  border-radius: 0.65rem 0.65rem 0 0;
  background:
    linear-gradient(
      to top,
      color-mix(in oklab, var(--primary) 70%, #f97316),
      color-mix(in oklab, var(--primary) 45%, #facc15)
    );
}

@media (max-width: 1279px) {
  .crude-dashboard > section:last-of-type {
    grid-template-columns: minmax(0, 1fr);
  }

  .crude-dashboard > section:last-of-type > div {
    grid-template-rows: auto;
  }
}

@media (max-width: 768px) {
  .kpi-row {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .kpi-months {
    order: 3;
    width: 100%;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .kpi-month {
    min-width: 0;
  }

  .rolling-calendar {
    min-width: 840px;
    grid-template-columns: repeat(7, minmax(112px, 1fr));
  }

  .rolling-day {
    min-height: 116px;
  }

  .origin-row {
    grid-template-columns: minmax(105px, 0.9fr) minmax(100px, 1.5fr) 52px;
  }

  .refinery-chart {
    min-width: 560px;
  }
}
</style>
