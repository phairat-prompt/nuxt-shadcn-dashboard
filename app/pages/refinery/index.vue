<script setup lang="ts">
type CrudeOilSchedule = {
  date: string
  origin: string
  tanker: string
  refinery: string
  volume: number
  status: 'Confirmed' | 'In Transit' | 'Planning'
}

const timeRange = ref('30d')

const isDesktop = useMediaQuery('(min-width: 768px)')

watch(
  isDesktop,
  () => {
    timeRange.value = isDesktop.value ? '30d' : '7d'
  },
  { immediate: true },
)

const crudeOilSchedules: CrudeOilSchedule[] = [
  {
    date: '19 พ.ค. 69',
    origin: 'UAE',
    tanker: 'YANNIS P.',
    refinery: 'IRPC',
    volume: 1.10,
    status: 'Confirmed',
  },
  {
    date: '20 พ.ค. 69',
    origin: 'UAE',
    tanker: 'ULYSSES',
    refinery: 'Thai Oil',
    volume: 1.45,
    status: 'Confirmed',
  },
  {
    date: '21 พ.ค. 69',
    origin: 'Malaysia',
    tanker: 'DHT TIGER',
    refinery: 'BCP',
    volume: 0.27,
    status: 'In Transit',
  },
  {
    date: '23 พ.ค. 69',
    origin: 'Nigeria',
    tanker: 'ETHANE TOPAZ',
    refinery: 'PTT GC',
    volume: 1.30,
    status: 'In Transit',
  },
  {
    date: '24 พ.ค. 69',
    origin: 'Libya',
    tanker: 'SEAPEAK MAGELLAN',
    refinery: 'BSRC',
    volume: 0.18,
    status: 'Planning',
  },
]

function statusClass(status: CrudeOilSchedule['status']) {
  switch (status) {
    case 'Confirmed':
      return 'text-emerald-600 dark:text-emerald-400'

    case 'In Transit':
      return 'text-fuchsia-600 dark:text-fuchsia-400'

    case 'Planning':
      return 'text-amber-600 dark:text-amber-400'

    default:
      return 'text-muted-foreground'
  }
}

function formatVolume(volume: number) {
  return volume.toFixed(2)
}
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          ปริมาณน้ำมันดิบที่นำเข้าทางเรือที่เข้าในประเทศไทย
        </h2>
      </div>
    </div>

    <main class="@container/main flex flex-1 flex-col gap-4 md:gap-8">
      <!-- Chart -->
      <Card class="@container/card border-primary/10">
        <CardHeader>
          <CardTitle>
            ล้านบาร์เรล
          </CardTitle>

          <CardAction>
            <!-- Desktop -->
            <ToggleGroup
              v-model="timeRange"
              type="single"
              variant="outline"
              class="
                hidden
                *:data-[slot=toggle-group-item]:!px-4
                @[767px]/card:flex
              "
            >
              <ToggleGroupItem
                value="90d"
                class="
                  data-[state=on]:border-primary
                  data-[state=on]:bg-primary/10
                  data-[state=on]:text-primary
                "
              >
                Last 3 months
              </ToggleGroupItem>

              <ToggleGroupItem
                value="30d"
                class="
                  data-[state=on]:border-primary
                  data-[state=on]:bg-primary/10
                  data-[state=on]:text-primary
                "
              >
                Last 30 days
              </ToggleGroupItem>

              <ToggleGroupItem
                value="7d"
                class="
                  data-[state=on]:border-primary
                  data-[state=on]:bg-primary/10
                  data-[state=on]:text-primary
                "
              >
                Last 7 days
              </ToggleGroupItem>
            </ToggleGroup>

            <!-- Mobile -->
            <Select v-model="timeRange">
              <SelectTrigger
                class="
                  flex w-40
                  **:data-[slot=select-value]:block
                  **:data-[slot=select-value]:truncate
                  @[767px]/card:hidden
                "
                size="sm"
                aria-label="Select a time range"
              >
                <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>

              <SelectContent class="rounded-xl">
                <SelectItem value="90d" class="rounded-lg">
                  Last 3 months
                </SelectItem>

                <SelectItem value="30d" class="rounded-lg">
                  Last 30 days
                </SelectItem>

                <SelectItem value="7d" class="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>

        <CardContent class="h-[320px]">
          <DashboardTotalVisitors
            :time-range="timeRange"
            class="h-full"
          />
        </CardContent>
      </Card>

      <!-- Crude Oil Schedule Table -->
      <Card
        class="
          overflow-hidden
          border-border
          bg-card
          text-card-foreground
          shadow-sm
        "
      >
        <CardContent class="px-3 pb-3 pt-0 md:px-4">
          <div class="overflow-x-auto">
            <table class="crude-oil-table">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>แหล่งผลิต (Origin)</th>
                  <th>เรือ (Crude Oil Tanker)</th>
                  <th>โรงกลั่น (Refinery)</th>
                  <th>ปริมาณ (ล้านบาร์เรล)</th>
                  <th>สถานะ (Status)</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in crudeOilSchedules"
                  :key="`${item.date}-${item.tanker}`"
                >
                  <td>
                    {{ item.date }}
                  </td>

                  <td>
                    {{ item.origin }}
                  </td>

                  <td>
                    {{ item.tanker }}
                  </td>

                  <td>
                    {{ item.refinery }}
                  </td>

                  <td class="tabular-nums">
                    {{ formatVolume(item.volume) }}
                  </td>

                  <td>
                    <span
                      class="font-semibold"
                      :class="statusClass(item.status)"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  </div>
</template>

<style scoped>
.crude-oil-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  table-layout: fixed;
  color: var(--foreground);
  font-size: 16px;
}

.crude-oil-table th,
.crude-oil-table td {
  border-bottom: 1px solid var(--border);
  text-align: center;
  white-space: nowrap;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
}

.crude-oil-table th {
  height: 45px;
  padding: 10px 12px;
  background:
    color-mix(
      in oklab,
      var(--primary) 8%,
      var(--card)
    );
  color: var(--primary);
  font-weight: 700;
}

.crude-oil-table td {
  height: 47px;
  padding: 10px 12px;
  background: var(--card);
  color: var(--card-foreground);
}

/* สลับสีพื้นหลังแต่ละแถว */
.crude-oil-table tbody tr:nth-child(even) td {
  background:
    color-mix(
      in oklab,
      var(--muted) 35%,
      var(--card)
    );
}

/* สีเมื่อเลื่อนเมาส์ผ่าน */
.crude-oil-table tbody tr:hover td {
  background:
    color-mix(
      in oklab,
      var(--primary) 10%,
      var(--card)
    );
}

/* เอาเส้นด้านล่างของแถวสุดท้ายออก */
.crude-oil-table tbody tr:last-child td {
  border-bottom: 0;
}

/* กำหนดความกว้างแต่ละคอลัมน์ */
.crude-oil-table th:nth-child(1) {
  width: 14%;
}

.crude-oil-table th:nth-child(2) {
  width: 17%;
}

.crude-oil-table th:nth-child(3) {
  width: 21%;
}

.crude-oil-table th:nth-child(4) {
  width: 18%;
}

.crude-oil-table th:nth-child(5) {
  width: 17%;
}

.crude-oil-table th:nth-child(6) {
  width: 13%;
}

@media (max-width: 768px) {
  .crude-oil-table {
    font-size: 14px;
  }

  .crude-oil-table th,
  .crude-oil-table td {
    height: 42px;
    padding: 8px 10px;
  }
}
</style>