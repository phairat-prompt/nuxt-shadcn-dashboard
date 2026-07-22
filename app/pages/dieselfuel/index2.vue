<script setup lang="ts">
type TableRow = {
  company: string
  values: string[]
  total?: boolean
}

type KpiItem = {
  title: string
  value: string
  unit: string
  description: string
  icon: string
}

const kpiItems: KpiItem[] = [
  {
    title: 'กลั่นหรือผลิต',
    value: '72.721',
    unit: 'ล้านลิตร',
    description: 'ผลรวมจากโรงกลั่น',
    icon: 'i-lucide-factory',
  },
  {
    title: 'ผสมเสร็จ',
    value: '31.432',
    unit: 'ล้านลิตร',
    description: 'ดีเซลหมุนเร็วธรรมดา',
    icon: 'i-lucide-warehouse',
  },
  {
    title: 'จำหน่ายลูกค้าทั่วไป',
    value: '26.866',
    unit: 'ล้านลิตร',
    description: 'ผู้ค้าจำหน่ายดีเซล',
    icon: 'i-lucide-building-2',
  },
  {
    title: 'จำหน่าย ม.10',
    value: '2.498',
    unit: 'ล้านลิตร',
    description: 'Jobber',
    icon: 'i-lucide-briefcase-business',
  },
  {
    title: 'รวมการจำหน่าย',
    value: '29.364',
    unit: 'ล้านลิตร',
    description: 'ลูกค้าทั่วไป + ม.10',
    icon: 'i-lucide-chart-no-axes-combined',
  },
]

const refineryRows: TableRow[] = [
  { company: 'BCP', values: ['9.930', '8.753'] },
  { company: 'BSRC', values: ['11.533', '10.096'] },
  { company: 'IRPC', values: ['7.658', '13.551'] },
  { company: 'GC', values: ['16.227', '15.020'] },
  { company: 'SPRC', values: ['10.914', '7.428'] },
  { company: 'TOP', values: ['18.940', '17.873'] },
  { company: 'รวม', values: ['75.202', '72.721'], total: true },
]

const producerRows: TableRow[] = [
  { company: 'BCP', values: ['10.34', '4.985'] },
  { company: 'BSRC', values: ['8.237', '4.258'] },
  { company: 'IRPC', values: ['5.67', '3.138'] },
  { company: 'OR', values: ['18.009', '11.014'] },
  { company: 'GC', values: ['2.944', '1.200'] },
  { company: 'SHELL', values: ['3.148', '1.444'] },
  { company: 'SINOPEC', values: ['0.193', '0.127'] },
  { company: 'SPRC', values: ['1.547', '0.323'] },
  { company: 'SFL', values: ['3.736', '1.165'] },
  { company: 'SUSCO', values: ['0.044', '-'] },
  { company: 'TOP', values: ['12.497', '3.777'] },
  { company: 'PC SIAM', values: ['-', '-'] },
  { company: 'รวม', values: ['66.365', '31.432'], total: true },
]

const generalCustomerRows: TableRow[] = [
  { company: 'BCP', values: ['4.717'] },
  { company: 'BSRC', values: ['4.201'] },
  { company: 'TOP', values: ['1.962'] },
  { company: 'IRPC', values: ['0.565'] },
  { company: 'PTTGC', values: ['0.273'] },
  { company: 'SFL', values: ['1.357'] },
  { company: 'OR', values: ['9.577'] },
  { company: 'SHELL', values: ['2.009'] },
  { company: 'SINOPEC SUSCO', values: ['0.014'] },
  { company: 'SUSCO', values: ['0.146'] },
  { company: 'PTT', values: ['0.680'] },
  { company: 'PTG', values: ['0.239'] },
  { company: 'UNIQUE GAS', values: ['0.076'] },
  { company: 'PTTRM', values: ['1.040'] },
  { company: 'IRPC OIL', values: ['0.010'] },
  { company: 'PC SIAM', values: ['-'] },
  { company: 'รวม', values: ['26.866'], total: true },
]

const jobberRows: TableRow[] = [
  { company: 'BCP', values: ['0.246'] },
  { company: '-', values: ['-'] },
  { company: 'TOP', values: ['0.390'] },
  { company: 'IRPC', values: ['1.462'] },
  { company: '-', values: ['-'] },
  { company: 'SFL', values: ['0.193'] },
  { company: 'OR', values: ['0.179'] },
  { company: 'SHELL', values: ['0.028'] },
  { company: '-', values: ['-'] },
  { company: '-', values: ['-'] },
  { company: '-', values: ['-'] },
  { company: 'PTG', values: ['-'] },
  { company: '-', values: ['-'] },
  { company: '-', values: ['-'] },
  { company: 'PC SIAM', values: ['-'] },
  { company: 'รวม', values: ['2.498'], total: true },
]
</script>

<template>
  <div class="diesel-dashboard w-full min-w-0 space-y-3">
    <!-- Header -->
    <header class="flex flex-wrap items-center justify-between gap-2">
      <div class="min-w-0">
        <h2 class="text-2xl font-bold tracking-tight">
          โครงสร้างการผลิตและจำหน่ายดีเซลหมุนเร็ว
        </h2>

        <!-- <p class="text-sm text-muted-foreground">
          ข้อมูล ณ วันที่ 19 เมษายน 2569 · หน่วย: ล้านลิตร
        </p> -->
      </div>

      <div class="shrink-0">
        <BaseDateRangePicker />
      </div>
    </header>



    <!-- Main layout -->
    <section
      class="
        grid min-w-0 items-start gap-3
        xl:grid-cols-[minmax(280px,0.85fr)_minmax(310px,1fr)_minmax(0,1.8fr)]
      "
    >
      <!-- Refinery -->
      <Card class="min-w-0 gap-0 overflow-hidden rounded-2xl border-border/80 py-0 shadow-sm">
        <CardHeader class="px-4 pb-3 pt-4">
          <div class="flex items-center gap-3">
            <div class="section-icon">
              <Icon name="i-lucide-factory" size="23" />
            </div>

            <div class="min-w-0">
              <CardTitle class="text-lg">
                โรงกลั่นผลิตดีเซลพื้นฐาน
              </CardTitle>

              <!-- <CardDescription>
                ปริมาณกลั่นหรือผลิต ณ วันที่ 19 เม.ย.
              </CardDescription> -->
            </div>
          </div>
        </CardHeader>

        <CardContent class="p-0">
          <div class="overflow-x-auto">
            <table class="dashboard-table dashboard-table-gray">
              <thead>
                <tr>
                  <th>บริษัท</th>
                  <th>เฉลี่ย ม.ค.</th>
                  <th>กลั่นหรือผลิต 19 เม.ย.</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="row in refineryRows"
                  :key="row.company"
                  :class="{ 'total-row': row.total }"
                >
                  <td>{{ row.company }}</td>
                  <td class="tabular-nums">{{ row.values[0] }}</td>
                  <td class="tabular-nums">{{ row.values[1] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Producer -->
      <div class="min-w-0 space-y-3">
        <Card class="min-w-0 gap-0 overflow-hidden rounded-2xl border-border/80 py-0 shadow-sm">
          <CardHeader class="px-4 pb-3 pt-4">
            <div class="flex items-center gap-3">
              <div class="section-icon">
                <Icon name="i-lucide-warehouse" size="23" />
              </div>

              <div class="min-w-0">
                <CardTitle class="text-lg">
                  ผู้ผลิตดีเซลหมุนเร็วธรรมดา (ถังผสม)
                </CardTitle>

                <!-- <CardDescription>
                  ถังผสม
                </CardDescription> -->
              </div>
            </div>
          </CardHeader>

          <CardContent class="p-0">
            <div class="overflow-x-auto">
              <table class="dashboard-table dashboard-table-blue">
                <thead>
                  <tr>
                    <th>บริษัท</th>
                    <th>เฉลี่ย ม.ค.</th>
                    <th>ผสมเสร็จ 19 เม.ย.</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="row in producerRows"
                    :key="row.company"
                    :class="{ 'total-row': row.total }"
                  >
                    <td>{{ row.company }}</td>
                    <td class="tabular-nums">{{ row.values[0] }}</td>
                    <td class="tabular-nums">{{ row.values[1] }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card class="gap-0 rounded-2xl border-border/80 py-0 shadow-sm">
          <CardContent class="p-4">
            <div class="flex items-start gap-3">
              <div class="section-icon">
                <Icon name="i-lucide-info" size="20" />
              </div>

              <div class="min-w-0 text-sm">
                <p class="font-semibold">
                  รวมการจำหน่ายดีเซลหมุนเร็วธรรมดา บี20
                </p>
                <p class="mt-1 text-muted-foreground">
                  BCP จำหน่ายภาคอุตสาหกรรม
                </p>
                <p class="text-muted-foreground">
                  UNIQUE GAS จำหน่ายสถานีบริการ
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Sales -->
      <Card class="min-w-0 gap-0 overflow-hidden rounded-2xl border-border/80 py-0 shadow-sm">
        <CardHeader class="px-4 pb-3 pt-4">
          <!-- <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle class="text-lg">
                การจำหน่ายดีเซลหมุนเร็ว
              </CardTitle>

              <CardDescription>
                ลูกค้าทั่วไปและผู้ค้าตามมาตรา 10
              </CardDescription>
            </div>

            <Badge
              variant="outline"
              class="border-primary/30 bg-primary/10 px-3 py-1 text-primary"
            >
              รวม 29.364 ล้านลิตร
            </Badge>
          </div> -->
        </CardHeader>

        <CardContent class="p-3 pt-0">
          <div class="grid min-w-0 gap-3 lg:grid-cols-2">
            <!-- General customers -->
            <div class="sales-panel sales-panel-general">
              <div class="sales-panel-title">
                <div class="section-icon">
                  <Icon name="i-lucide-building-2" size="20" />
                </div>

                <div>
                  <h3>ผู้ค้าจำหน่ายดีเซล</h3>
                  <p>ลูกค้าทั่วไป</p>
                </div>
              </div>

              <div class="overflow-x-auto">
                <table class="dashboard-table dashboard-table-orange">
                  <thead>
                    <tr>
                      <th>บริษัท</th>
                      <th>จำหน่าย 19 เม.ย.</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(row, index) in generalCustomerRows"
                      :key="`${row.company}-${index}`"
                      :class="{ 'total-row': row.total }"
                    >
                      <td>{{ row.company }}</td>
                      <td class="tabular-nums">{{ row.values[0] }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Jobber -->
            <div class="sales-panel sales-panel-jobber">
              <div class="sales-panel-title">
                <div class="section-icon">
                  <Icon name="i-lucide-briefcase-business" size="20" />
                </div>

                <div>
                  <h3>ผู้ค้าจำหน่ายดีเซลหมุนเร็วธรรมดา</h3>
                  <p>จำหน่าย ม.10 Jobber</p>
                </div>
              </div>

              <div class="overflow-x-auto">
                <table class="dashboard-table dashboard-table-yellow">
                  <thead>
                    <tr>
                      <th>บริษัท</th>
                      <th>จำหน่าย ม.10 19 เม.ย.</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(row, index) in jobberRows"
                      :key="`${row.company}-${index}`"
                      :class="{ 'total-row': row.total }"
                    >
                      <td>{{ row.company }}</td>
                      <td class="tabular-nums">{{ row.values[0] }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="summary-bar">
            <Icon name="i-lucide-equal" size="21" />

            <span>
              รวมจำหน่ายลูกค้าทั่วไป + ม.10
            </span>

            <strong class="tabular-nums">
              29.364 ล้านลิตร
            </strong>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>

<style scoped>
.diesel-dashboard {
  --table-line: color-mix(in oklab, var(--border) 88%, transparent);

  --gray-head:
    color-mix(in oklab, var(--muted-foreground) 55%, var(--card));
  --gray-body:
    color-mix(in oklab, var(--muted) 64%, var(--card));

  --blue-head:
    color-mix(in oklab, var(--primary) 28%, var(--card));
  --blue-body:
    color-mix(in oklab, var(--primary) 7%, var(--card));

  --orange:
    var(--chart-3, #f97316);
  --orange-head:
    color-mix(in oklab, var(--orange) 30%, var(--card));
  --orange-body:
    color-mix(in oklab, var(--orange) 8%, var(--card));

  --yellow:
    var(--chart-4, #eab308);
  --yellow-head:
    color-mix(in oklab, var(--yellow) 30%, var(--card));
  --yellow-body:
    color-mix(in oklab, var(--yellow) 9%, var(--card));

  --total:
    color-mix(in oklab, var(--primary) 15%, var(--card));
}

.diesel-dashboard :deep([data-slot='card-header']) {
  gap: 0.25rem;
}

.section-icon {
  display: flex;
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 0.8rem;
  background: var(--primary);
  color: var(--primary-foreground);
}

.dashboard-table {
  width: 100%;
  min-width: 300px;
  border-collapse: collapse;
  table-layout: fixed;
  color: var(--foreground);
  font-size: 0.84rem;
}

.dashboard-table th,
.dashboard-table td {
  padding: 0.55rem 0.65rem;
  border-right: 1px solid var(--table-line);
  border-bottom: 1px solid var(--table-line);
  text-align: center;
  vertical-align: middle;
  line-height: 1.15;
}

.dashboard-table th:last-child,
.dashboard-table td:last-child {
  border-right: 0;
}

.dashboard-table tbody tr:last-child td {
  border-bottom: 0;
}

.dashboard-table th {
  color: var(--foreground);
  font-weight: 700;
}

.dashboard-table td:first-child {
  font-weight: 600;
}

.dashboard-table-gray th {
  background: var(--gray-head);
  color: var(--primary-foreground);
}

.dashboard-table-gray td {
  background: var(--gray-body);
}

.dashboard-table-blue th {
  background: var(--blue-head);
}

.dashboard-table-blue td {
  background: var(--blue-body);
}

.dashboard-table-orange th {
  background: var(--orange-head);
}

.dashboard-table-orange td {
  background: var(--orange-body);
}

.dashboard-table-yellow th {
  background: var(--yellow-head);
}

.dashboard-table-yellow td {
  background: var(--yellow-body);
}

.dashboard-table .total-row td {
  background: var(--total);
  font-weight: 800;
}

.sales-panel {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 1rem;
}

.sales-panel-title {
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border);
  text-align: center;
}

.sales-panel-title h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.2;
}

.sales-panel-title p {
  margin: 0.15rem 0 0;
  color: var(--muted-foreground);
  font-size: 0.76rem;
}

.sales-panel-general {
  background:
    color-mix(in oklab, var(--orange) 3%, var(--card));
}

.sales-panel-jobber {
  background:
    color-mix(in oklab, var(--yellow) 3%, var(--card));
}

.summary-bar {
  display: flex;
  width: fit-content;
  max-width: 100%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.85rem auto 0;
  padding: 0.6rem 1rem;
  border: 1px solid color-mix(in oklab, var(--primary) 28%, var(--border));
  border-radius: 0.85rem;
  background: color-mix(in oklab, var(--primary) 8%, var(--card));
  color: var(--primary);
  text-align: center;
}

@media (max-width: 1280px) {
  .dashboard-table {
    font-size: 0.8rem;
  }

  .dashboard-table th,
  .dashboard-table td {
    padding: 0.5rem;
  }
}

@media (max-width: 768px) {
  .dashboard-table {
    min-width: 340px;
  }
}
</style>
