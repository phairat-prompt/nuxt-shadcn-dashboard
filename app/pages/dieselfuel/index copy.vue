<script setup lang="ts">
import { defineComponent, h } from 'vue'

type Row = {
  company: string
  values: string[]
  total?: boolean
}

const refineryRows: Row[] = [
  { company: 'BCP', values: ['9.930', '8.753'] },
  { company: 'BSRC', values: ['11.533', '10.096'] },
  { company: 'IRPC', values: ['7.658', '13.551'] },
  { company: 'GC', values: ['16.227', '15.020'] },
  { company: 'SPRC', values: ['10.914', '7.428'] },
  { company: 'TOP', values: ['18.940', '17.873'] },
  { company: 'รวม', values: ['75.202', '72.721'], total: true },
]

const mixerRows: Row[] = [
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

const customerRows: Row[] = [
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

const jobberRows: Row[] = [
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

const DataTable = defineComponent({
  name: 'DistributionDataTable',
  props: {
    columns: {
      type: Array as () => string[],
      required: true,
    },
    rows: {
      type: Array as () => Row[],
      required: true,
    },
    variant: {
      type: String,
      default: 'gray',
    },
  },
  setup(props) {
    return () =>
      h(
        'div',
        { class: 'distribution-table-shell' },
        [
          h(
            'table',
            {
              class: [
                'distribution-data-table',
                `distribution-table-${props.variant}`,
                `distribution-cols-${props.columns.length}`,
              ],
            },
            [
              h(
                'thead',
                {},
                [
                  h(
                    'tr',
                    {},
                    props.columns.map(column =>
                      h('th', { title: column }, column),
                    ),
                  ),
                ],
              ),
              h(
                'tbody',
                {},
                props.rows.map((row, index) =>
                  h(
                    'tr',
                    {
                      key: `${row.company}-${index}`,
                      class: row.total ? 'distribution-total-row' : '',
                    },
                    [
                      h('td', {}, row.company),
                      ...row.values.map((value, valueIndex) =>
                        h(
                          'td',
                          {
                            key: `${row.company}-${valueIndex}`,
                            class: 'tabular-nums',
                          },
                          value,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      )
  },
})
</script>

<template>
  <div class="distribution-page">
    <header class="distribution-toolbar">
      <div class="min-w-0">
        <h2 class="text-2xl font-bold tracking-tight">
          โครงสร้างการผลิตและจำหน่ายดีเซลหมุนเร็ว
        </h2>

        <p class="text-sm text-muted-foreground">
          ข้อมูล ณ วันที่ 19 เมษายน 2569 · หน่วย: ล้านลิตร
        </p>
      </div>

      <div class="shrink-0">
        <BaseDateRangePicker />
      </div>
    </header>

    <main class="distribution-diagram">
      <!-- โรงกลั่น -->
      <section class="distribution-block distribution-refinery">
        <div class="distribution-block-title">
          <Icon name="i-lucide-factory" class="distribution-block-icon" />

          <span>
            โรงกลั่นผลิตดีเซลพื้นฐาน
          </span>
        </div>

        <DataTable
          variant="gray"
          :columns="[
            'บริษัท',
            'เฉลี่ย ม.ค.',
            'กลั่นหรือผลิต 19 เม.ย.',
          ]"
          :rows="refineryRows"
        />
      </section>

      <div class="distribution-arrow distribution-arrow-1" />

      <!-- ผู้ผลิต -->
      <section class="distribution-block distribution-mixer">
        <div class="distribution-block-title">
          <Icon name="i-lucide-database" class="distribution-block-icon" />

          <span>
            ผู้ผลิตดีเซลหมุนเร็วธรรมดา
            <small>(ถังผสม)</small>
          </span>
        </div>

        <DataTable
          variant="blue"
          :columns="[
            'บริษัท',
            'เฉลี่ย ม.ค.',
            'ผสมเสร็จ 19 เม.ย.',
          ]"
          :rows="mixerRows"
        />

        <div class="distribution-note">
          <p class="font-bold">
            รวมการจำหน่ายดีเซลหมุนเร็วธรรมดา บี20
          </p>
          <p>- BCP จำหน่ายภาคอุตสาหกรรม</p>
          <p>- UNIQUE GAS จำหน่ายสถานีบริการ</p>
        </div>
      </section>

      <div class="distribution-arrow distribution-arrow-2" />

      <!-- จำหน่าย -->
      <section class="distribution-sales">
        <div class="distribution-sales-title">
          <div>
            <h3>ผู้ค้าจำหน่ายดีเซล</h3>
            <p>(ลูกค้าทั่วไป)</p>
          </div>

          <div class="distribution-plus">
            +
          </div>

          <div>
            <h3>ผู้ค้าจำหน่ายดีเซลหมุนเร็วธรรมดา</h3>
            <p>(จำหน่าย ม.10 Jobber)</p>
          </div>
        </div>

        <div class="distribution-sales-tables">
          <DataTable
            variant="orange"
            :columns="[
              'บริษัท',
              'จำหน่าย 19 เม.ย.',
            ]"
            :rows="customerRows"
          />

          <DataTable
            variant="yellow"
            :columns="[
              'บริษัท',
              'จำหน่าย ม.10 19 เม.ย.',
            ]"
            :rows="jobberRows"
          />
        </div>

        <div class="distribution-summary">
          <Icon name="i-lucide-equal" class="size-6 shrink-0" />

          <strong>
            รวมจำหน่ายลูกค้าทั่วไป + ม.10 = 29.364
          </strong>
        </div>
      </section>
    </main>

    <footer class="distribution-footer">
      <div>ข้อมูล ณ วันที่ 19 เมษายน 2569</div>
      <div>หน่วย: ล้านลิตร</div>
    </footer>
  </div>
</template>

<!--
  ไม่ใช้ scoped เพราะ DataTable ถูกสร้างด้วย defineComponent + h()
  แต่ทุก selector มี prefix .distribution-page จึงไม่กระทบหน้าอื่น
-->
<style>
.distribution-page {
  width: 100%;
  min-width: 0;
  overflow-x: hidden;
  color: var(--foreground);
  font-family: Tahoma, Arial, sans-serif;

  --distribution-line: color-mix(in oklab, var(--foreground) 85%, transparent);
  --distribution-arrow: color-mix(in oklab, var(--foreground) 80%, transparent);

  --distribution-gray-head:
    color-mix(in oklab, var(--foreground) 48%, var(--card));
  --distribution-gray-body:
    color-mix(in oklab, var(--muted) 72%, var(--card));

  --distribution-blue-head:
    color-mix(in oklab, var(--primary) 28%, var(--card));
  --distribution-blue-body:
    color-mix(in oklab, var(--primary) 8%, var(--card));

  --distribution-orange:
    var(--chart-3, #f59e0b);
  --distribution-orange-head:
    color-mix(in oklab, var(--distribution-orange) 35%, var(--card));
  --distribution-orange-body:
    color-mix(in oklab, var(--distribution-orange) 12%, var(--card));

  --distribution-yellow:
    var(--chart-4, #eab308);
  --distribution-yellow-head:
    color-mix(in oklab, var(--distribution-yellow) 38%, var(--card));
  --distribution-yellow-body:
    color-mix(in oklab, var(--distribution-yellow) 14%, var(--card));

  --distribution-total:
    color-mix(in oklab, var(--primary) 28%, var(--card));
}

.distribution-page,
.distribution-page * {
  box-sizing: border-box;
}

.distribution-toolbar {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.distribution-diagram {
  container-type: inline-size;
  display: grid;
  grid-template-columns:
    minmax(250px, 0.83fr)
    clamp(38px, 3vw, 56px)
    minmax(280px, 0.94fr)
    clamp(38px, 3vw, 56px)
    minmax(570px, 1.85fr);
  grid-template-areas:
    "refinery arrow1 mixer arrow2 sales";
  align-items: start;
  gap: clamp(0.55rem, 0.8vw, 0.9rem);
  width: 100%;
  min-width: 0;
}

.distribution-refinery {
  grid-area: refinery;
}

.distribution-mixer {
  grid-area: mixer;
}

.distribution-arrow-1 {
  grid-area: arrow1;
}

.distribution-arrow-2 {
  grid-area: arrow2;
}

.distribution-sales {
  grid-area: sales;
}

.distribution-block,
.distribution-sales {
  min-width: 0;
}

.distribution-block-title {
  display: flex;
  min-height: 96px;
  align-items: center;
  justify-content: center;
  gap: clamp(0.5rem, 0.8vw, 0.9rem);
  color: var(--foreground);
  font-size: clamp(17px, 1.45vw, 25px);
  font-weight: 900;
  line-height: 1.12;
  text-align: center;
}

.distribution-block-title span {
  min-width: 0;
}

.distribution-block-title small {
  display: block;
  margin-top: 0.2rem;
  color: var(--muted-foreground);
  font-size: 0.78em;
}

.distribution-block-icon {
  width: clamp(38px, 3.5vw, 55px);
  height: clamp(38px, 3.5vw, 55px);
  flex: 0 0 auto;
  color: var(--primary);
}

.distribution-arrow {
  --line-height: clamp(6px, 0.45vw, 8px);
  --head-width: clamp(19px, 1.6vw, 28px);
  --head-height: clamp(18px, 1.5vw, 26px);

  position: relative;
  width: 100%;
  height: var(--head-height);
  margin-top: 167px;
}

.distribution-arrow::before {
  position: absolute;
  top: 50%;
  right: var(--head-width);
  left: 0;
  height: var(--line-height);
  background: var(--distribution-arrow);
  content: "";
  transform: translateY(-50%);
}

.distribution-arrow::after {
  position: absolute;
  top: 50%;
  right: 0;
  width: 0;
  height: 0;
  border-top: calc(var(--head-height) / 2) solid transparent;
  border-bottom: calc(var(--head-height) / 2) solid transparent;
  border-left: var(--head-width) solid var(--distribution-arrow);
  content: "";
  transform: translateY(-50%);
}

.distribution-sales {
  padding: clamp(0.65rem, 0.9vw, 0.9rem);
  border: 1px dashed color-mix(in oklab, var(--primary) 75%, transparent);
  background: color-mix(in oklab, var(--primary) 2%, transparent);
}

.distribution-sales-title {
  display: grid;
  min-height: 88px;
  grid-template-columns: minmax(0, 1fr) 44px minmax(0, 1fr);
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.distribution-sales-title h3 {
  margin: 0;
  color: var(--foreground);
  font-size: clamp(15px, 1.22vw, 21px);
  font-weight: 900;
  line-height: 1.12;
}

.distribution-sales-title p {
  margin: 0.2rem 0 0;
  color: var(--muted-foreground);
  font-size: clamp(12px, 0.9vw, 16px);
  font-weight: 700;
  line-height: 1.1;
}

.distribution-plus {
  color: var(--primary);
  font-size: clamp(40px, 3.4vw, 58px);
  font-weight: 900;
  line-height: 1;
}

.distribution-sales-tables {
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr);
  align-items: start;
  gap: clamp(1rem, 2.5vw, 2.6rem);
  min-width: 0;
}

.distribution-table-shell {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--distribution-line);
}

.distribution-data-table {
  width: 100%;
  min-width: 0;
  border-collapse: collapse;
  table-layout: fixed;
  color: var(--foreground);
  font-size: clamp(12px, 0.87vw, 16px);
}

.distribution-data-table th,
.distribution-data-table td {
  padding: 0.28rem 0.38rem;
  border-right: 1px solid var(--distribution-line);
  border-bottom: 1px solid var(--distribution-line);
  overflow-wrap: anywhere;
  text-align: center;
  vertical-align: middle;
  white-space: normal;
  font-weight: 700;
  line-height: 1.08;
}

.distribution-data-table th {
  height: 52px;
  font-weight: 900;
}

.distribution-data-table td {
  height: 29px;
}

.distribution-data-table th:last-child,
.distribution-data-table td:last-child {
  border-right: 0;
}

.distribution-data-table tbody tr:last-child td {
  border-bottom: 0;
}

.distribution-data-table td:first-child {
  font-weight: 900;
}

.distribution-cols-3 th:first-child {
  width: 34%;
}

.distribution-cols-3 th:nth-child(2),
.distribution-cols-3 th:nth-child(3) {
  width: 33%;
}

.distribution-cols-2 th:first-child {
  width: 52%;
}

.distribution-cols-2 th:last-child {
  width: 48%;
}

.distribution-table-gray th {
  background: var(--distribution-gray-head);
  color: var(--primary-foreground);
}

.distribution-table-gray td {
  background: var(--distribution-gray-body);
}

.distribution-table-blue th {
  background: var(--distribution-blue-head);
}

.distribution-table-blue td {
  background: var(--distribution-blue-body);
}

.distribution-table-orange th {
  background: var(--distribution-orange-head);
}

.distribution-table-orange td {
  background: var(--distribution-orange-body);
}

.distribution-table-yellow th {
  background: var(--distribution-yellow-head);
}

.distribution-table-yellow td {
  background: var(--distribution-yellow-body);
}

.distribution-total-row td {
  background: var(--distribution-total) !important;
  color: var(--foreground);
  font-weight: 900;
}

.distribution-table-orange .distribution-total-row td,
.distribution-table-yellow .distribution-total-row td {
  background: var(--card) !important;
}

.distribution-note {
  width: 100%;
  margin-top: clamp(0.75rem, 1vw, 1rem);
  padding: 0.7rem 0.85rem;
  border: 1px solid color-mix(in oklab, var(--distribution-orange) 22%, var(--border));
  background: color-mix(in oklab, var(--distribution-orange) 13%, var(--card));
  color: var(--foreground);
  font-size: clamp(11px, 0.75vw, 14px);
  line-height: 1.35;
}

.distribution-note p {
  margin: 0;
}

.distribution-summary {
  display: flex;
  width: fit-content;
  max-width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin: clamp(0.8rem, 1vw, 1rem) auto 0;
  padding: 0.55rem 1rem;
  border: 1px solid color-mix(in oklab, var(--primary) 30%, var(--border));
  background: color-mix(in oklab, var(--primary) 8%, var(--card));
  color: var(--primary);
  font-size: clamp(14px, 1.15vw, 20px);
  line-height: 1.15;
  text-align: center;
}

.distribution-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.9rem;
  color: var(--foreground);
  font-size: clamp(12px, 0.82vw, 15px);
  font-weight: 700;
}

.distribution-footer div {
  padding: 0.45rem 0.8rem;
  border: 1px solid var(--border);
  background: var(--muted);
}

@container (max-width: 1240px) {
  .distribution-diagram {
    grid-template-columns:
      minmax(0, 1fr)
      44px
      minmax(0, 1.08fr);
    grid-template-areas:
      "refinery arrow1 mixer"
      "sales sales sales";
  }

  .distribution-arrow-2 {
    display: none;
  }

  .distribution-sales {
    margin-top: 1rem;
  }

  .distribution-data-table {
    font-size: clamp(12px, 1.15vw, 15px);
  }
}

@container (max-width: 720px) {
  .distribution-diagram {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "refinery"
      "arrow1"
      "mixer"
      "arrow2"
      "sales";
  }

  .distribution-arrow-2 {
    display: block;
  }

  .distribution-arrow {
    width: 24px;
    height: 46px;
    margin: 0.35rem auto;
  }

  .distribution-arrow::before {
    top: 0;
    right: auto;
    bottom: 14px;
    left: 50%;
    width: 6px;
    height: auto;
    transform: translateX(-50%);
  }

  .distribution-arrow::after {
    top: auto;
    right: auto;
    bottom: 0;
    left: 50%;
    border-top: 16px solid var(--distribution-arrow);
    border-right: 12px solid transparent;
    border-bottom: 0;
    border-left: 12px solid transparent;
    transform: translateX(-50%);
  }

  .distribution-block-title {
    min-height: auto;
    padding: 0.65rem 0;
  }

  .distribution-sales-title {
    grid-template-columns: minmax(0, 1fr);
  }

  .distribution-sales-tables {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.8rem;
  }

  .distribution-data-table {
    font-size: 13px;
  }

  .distribution-footer {
    flex-direction: column;
  }

  .distribution-footer div {
    width: 100%;
  }
}
</style>
