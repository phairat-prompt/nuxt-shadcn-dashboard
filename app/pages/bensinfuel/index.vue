<script setup lang="ts">
import { defineComponent, h } from 'vue'

type Row = {
  company: string
  values: string[]
  total?: boolean
}

const refineryRows: Row[] = [
  { company: 'BCP', values: ['5.095', '9.975'] },
  { company: 'BSRC', values: ['6.656', '12.624'] },
  { company: 'IRPC', values: ['5.813', '6.130'] },
  { company: 'SPRC', values: ['6.871', '8.697'] },
  { company: 'TOP', values: ['8.830', '13.777'] },
  { company: 'รวม', values: ['33.265', '51.203'], total: true },
]

const mixerRows: Row[] = [
  { company: 'BCP', values: ['5.289', '3.655'] },
  { company: 'BSRC', values: ['4.189', '2.232'] },
  { company: 'IRPC', values: ['2.436', '5.267'] },
  { company: 'OR', values: ['11.681', '6.168'] },
  { company: 'SHELL', values: ['1.750', '1.177'] },
  { company: 'SINOPEC', values: ['0.184', '0.186'] },
  { company: 'SPRC', values: ['0.697', '0.242'] },
  { company: 'SFL', values: ['1.848', '0.820'] },
  { company: 'TOP', values: ['4.323', '2.285'] },
  { company: 'รวม', values: ['32.396', '22.032'], total: true },
]

const customerRows: Row[] = [
  { company: 'PTT', values: ['0.079', '0.055'] },
  { company: 'SHELL', values: ['2.332', '1.132'] },
  { company: 'BSRC', values: ['4.025', '2.654'] },
  { company: 'BCP', values: ['4.769', '3.090'] },
  { company: 'SUSCO', values: ['0.595', '0.179'] },
  { company: 'PTG', values: ['0.765', '0.105'] },
  { company: 'TOP', values: ['2.519', '1.210'] },
  { company: 'SINOPEC', values: ['0.074', '0.061'] },
  { company: 'PTTRM', values: ['0.977', '0.947'] },
  { company: 'IRPC OIL', values: ['0.006', '0.004'] },
  { company: 'IRPC', values: ['1.582', '0.180'] },
  { company: 'SFL', values: ['11.949', '0.874'] },
  { company: 'OR', values: ['2.584', '5.982'] },
  { company: 'PC SIAM', values: ['0.071', '-'] },
  { company: 'รวม', values: ['32.327', '16.472'], total: true },
]

const jobberRows: Row[] = [
  { company: 'SHELL', values: ['0.306', '-'] },
  { company: 'PTTGC', values: ['-', '-'] },
  { company: 'BSRC', values: ['0.080', '-'] },
  { company: 'BCP', values: ['0.119', '0.055'] },
  { company: 'SUSCO', values: ['0.002', '-'] },
  { company: 'PTG', values: ['0.024', '-'] },
  { company: 'SINOPEC', values: ['-', '-'] },
  { company: 'TOP', values: ['0.057', '0.100'] },
  { company: 'SPRC', values: ['-', '-'] },
  { company: 'OR', values: ['0.366', '0.028'] },
  { company: 'SFL', values: ['0.514', '0.162'] },
  { company: 'IRPC', values: ['0.568', '0.505'] },
  { company: 'PTT', values: ['-', '-'] },
  { company: 'PC SIAM', values: ['0.009', '-'] },
  { company: 'รวม', values: ['2.044', '0.850'], total: true },
]

const DataTable = defineComponent({
  name: 'GasolineDistributionDataTable',
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
    return () => h(
      'div',
      { class: 'gasoline-table-shell' },
      [
        h(
          'table',
          {
            class: [
              'gasoline-data-table',
              `table-${props.variant}`,
            ],
          },
          [
            h(
              'thead',
              h(
                'tr',
                props.columns.map(column => h('th', { title: column }, column)),
              ),
            ),
            h(
              'tbody',
              props.rows.map(row => h(
                'tr',
                { class: row.total ? 'total-row' : '' },
                [
                  h('td', row.company),
                  ...row.values.map(value => h('td', { class: 'tabular-nums' }, value)),
                ],
              )),
            ),
          ],
        ),
      ],
    )
  },
})
</script>

<template>
  <div class="gasoline-distribution-page">
    <div class="gasoline-page-toolbar">
      <div class="min-w-0">
        <h2 class="text-2xl font-bold tracking-tight">
          โครงสร้างการผลิตและจำหน่ายเบนซิน กลุ่มแก๊สโซฮอล์
        </h2>

        <!-- <p class="text-sm text-muted-foreground">
          ข้อมูล ณ วันที่ 19 เมษายน 2569 · หน่วย: ล้านลิตร
        </p> -->
      </div>

      <div class="shrink-0">
        <BaseDateRangePicker />
      </div>
    </div>

    <Card class="gasoline-distribution-card">
      <CardContent class="p-3 sm:p-4">
        <div class="gasoline-distribution-canvas">
          <main class="gasoline-diagram">
            <section class="gasoline-diagram-block gasoline-refinery-block">
              <div class="gasoline-block-title gasoline-block-title-tall">
                <Icon name="i-lucide-factory" class="gasoline-block-icon" />

                <span>
                  โรงกลั่นผลิตเบนซินพื้นฐาน
                  <small>
                    ชนิดที่ 1 และ 2<br>
                    และน้ำมันเบนซินออกเทน 91<br>
                    ออกเทน 92 และ 95
                  </small>
                </span>
              </div>

              <DataTable
                variant="gray"
                :columns="[
                  'บริษัท',
                  'สถิติเฉลี่ย ม.ค.',
                  'กลั่น/ผลิต 19 เม.ย.',
                ]"
                :rows="refineryRows"
              />
            </section>

            <div class="gasoline-flow-arrow gasoline-arrow-1" />

            <section class="gasoline-diagram-block gasoline-mixer-block">
              <div class="gasoline-block-title gasoline-block-title-tall">
                <Icon name="i-lucide-database" class="gasoline-block-icon" />

                <span>
                  ผู้ค้าผลิตเบนซิน แก๊สโซฮอล์
                  <small>(ผสมเอทานอล)</small>
                </span>
              </div>

              <DataTable
                variant="blue"
                :columns="[
                  'บริษัท',
                  'สถิติเฉลี่ย ม.ค.',
                  'ผสมเสร็จ 19 เม.ย.',
                ]"
                :rows="mixerRows"
              />
            </section>

            <div class="gasoline-flow-arrow gasoline-arrow-2" />

            <section class="gasoline-sales-wrapper">
              <div class="gasoline-sales-title">
                <div>
                  <h3>ผู้ค้าจำหน่ายเบนซิน กลุ่มแก๊สโซฮอล์</h3>
                  <p>(ลูกค้าทั่วไป)</p>
                </div>

                <div class="gasoline-plus">
                  +
                </div>

                <div>
                  <h3>ผู้ค้าจำหน่ายเบนซิน กลุ่มแก๊สโซฮอล์</h3>
                  <p>(จำหน่าย ม.10 Jobber)</p>
                </div>
              </div>

              <div class="gasoline-sales-tables">
                <DataTable
                  variant="purple"
                  :columns="[
                    'บริษัท',
                    'สถิติเฉลี่ย ม.ค.',
                    'การจำหน่าย 19 เม.ย.',
                  ]"
                  :rows="customerRows"
                />

                <DataTable
                  variant="blue"
                  :columns="[
                    'บริษัท',
                    'สถิติเฉลี่ย ม.ค.',
                    'จำหน่ายใช้ ม.10 19 เม.ย.',
                  ]"
                  :rows="jobberRows"
                />
              </div>

              <div class="gasoline-summary-box">
                <Icon name="i-lucide-equal" class="size-6 shrink-0" />

                <strong>
                  รวมจำหน่ายลูกค้าทั่วไป + ม.10 = 17.322
                </strong>
              </div>
            </section>
          </main>

          <footer class="gasoline-page-footer">
            <div>ข้อมูล ณ วันที่ 19 เมษายน 2569</div>
            <div>หน่วย: ล้านลิตร</div>
          </footer>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style>
.gasoline-distribution-page {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 1rem;
  overflow-x: hidden;
}

.gasoline-distribution-page .gasoline-page-toolbar {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.gasoline-distribution-page .gasoline-distribution-card {
  min-width: 0;
  overflow: hidden;
  border-color: color-mix(in oklab, var(--border) 85%, transparent);
  background: var(--card);
  color: var(--card-foreground);
}

.gasoline-distribution-page .gasoline-distribution-canvas {
  container-type: inline-size;
  width: 100%;
  min-width: 0;
  font-family: Tahoma, Arial, sans-serif;

  --gasoline-border: var(--border);
  --gasoline-arrow: color-mix(in oklab, var(--foreground) 76%, transparent);
  --gasoline-gray-head: color-mix(in oklab, var(--muted-foreground) 58%, var(--card));
  --gasoline-gray-body: color-mix(in oklab, var(--muted) 65%, var(--card));
  --gasoline-blue-head: color-mix(in oklab, var(--primary) 42%, var(--card));
  --gasoline-blue-body: color-mix(in oklab, var(--primary) 9%, var(--card));
  --gasoline-purple-color: var(--chart-4, #a855f7);
  --gasoline-purple-head: color-mix(in oklab, var(--gasoline-purple-color) 48%, var(--card));
  --gasoline-purple-body: color-mix(in oklab, var(--gasoline-purple-color) 10%, var(--card));
  --gasoline-total-blue: color-mix(in oklab, var(--primary) 35%, var(--card));
  --gasoline-total-purple: color-mix(in oklab, var(--gasoline-purple-color) 35%, var(--card));
}

.gasoline-distribution-page .gasoline-diagram {
  display: grid;
  grid-template-columns:
    minmax(0, 0.88fr)
    clamp(30px, 3vw, 54px)
    minmax(0, 0.95fr)
    clamp(30px, 3vw, 54px)
    minmax(0, 1.8fr);
  grid-template-areas: "refinery arrow1 mixer arrow2 sales";
  align-items: start;
  gap: clamp(0.35rem, 0.75vw, 0.8rem);
  width: 100%;
  min-width: 0;
}

.gasoline-distribution-page .gasoline-diagram-block,
.gasoline-distribution-page .gasoline-sales-wrapper {
  min-width: 0;
}

.gasoline-distribution-page .gasoline-refinery-block {
  grid-area: refinery;
}

.gasoline-distribution-page .gasoline-mixer-block {
  grid-area: mixer;
}

.gasoline-distribution-page .gasoline-arrow-1 {
  grid-area: arrow1;
}

.gasoline-distribution-page .gasoline-arrow-2 {
  grid-area: arrow2;
}

.gasoline-distribution-page .gasoline-sales-wrapper {
  grid-area: sales;
}

.gasoline-distribution-page .gasoline-block-title {
  display: flex;
  min-height: clamp(60px, 6vw, 96px);
  align-items: center;
  justify-content: center;
  gap: clamp(0.35rem, 0.7vw, 0.7rem);
  margin-bottom: clamp(0.4rem, 0.7vw, 0.75rem);
  color: var(--foreground);
  font-size: clamp(13px, 1.18vw, 21px);
  font-weight: 900;
  line-height: 1.12;
  text-align: center;
}

.gasoline-distribution-page .gasoline-block-title > span {
  display: block;
  min-width: 0;
}

.gasoline-distribution-page .gasoline-block-title small {
  display: block;
  margin-top: 0.18rem;
  color: var(--muted-foreground);
  font-size: 0.76em;
  line-height: 1.15;
}

.gasoline-distribution-page .gasoline-block-icon {
  width: clamp(32px, 3.4vw, 50px);
  height: clamp(32px, 3.4vw, 50px);
  flex: 0 0 auto;
  color: var(--primary);
}

.gasoline-distribution-page .gasoline-flow-arrow {
  --arrow-line-height: clamp(5px, 0.45vw, 8px);
  --arrow-head-width: clamp(16px, 1.5vw, 26px);
  --arrow-head-height: clamp(16px, 1.4vw, 24px);

  position: relative;
  width: 100%;
  height: var(--arrow-head-height);
  margin-top: clamp(120px, 13vw, 185px);
}

.gasoline-distribution-page .gasoline-flow-arrow::before {
  position: absolute;
  top: 50%;
  right: var(--arrow-head-width);
  left: 0;
  height: var(--arrow-line-height);
  background: var(--gasoline-arrow);
  content: "";
  transform: translateY(-50%);
}

.gasoline-distribution-page .gasoline-flow-arrow::after {
  position: absolute;
  top: 50%;
  right: 0;
  width: 0;
  height: 0;
  border-top: calc(var(--arrow-head-height) / 2) solid transparent;
  border-bottom: calc(var(--arrow-head-height) / 2) solid transparent;
  border-left: var(--arrow-head-width) solid var(--gasoline-arrow);
  content: "";
  transform: translateY(-50%);
}

.gasoline-distribution-page .gasoline-sales-wrapper {
  padding: clamp(0.5rem, 0.8vw, 0.8rem);
  border: 1px dashed color-mix(in oklab, var(--primary) 68%, transparent);
  border-radius: var(--radius);
  background: color-mix(in oklab, var(--primary) 2.5%, var(--card));
}

.gasoline-distribution-page .gasoline-sales-title {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 34px minmax(0, 1fr);
  align-items: center;
  gap: clamp(0.25rem, 0.5vw, 0.5rem);
  margin-bottom: clamp(0.4rem, 0.7vw, 0.75rem);
  text-align: center;
}

.gasoline-distribution-page .gasoline-sales-title h3 {
  margin: 0;
  color: var(--foreground);
  font-size: clamp(12px, 1.05vw, 18px);
  font-weight: 900;
  line-height: 1.15;
}

.gasoline-distribution-page .gasoline-sales-title p {
  margin: 0.15rem 0 0;
  color: var(--muted-foreground);
  font-size: clamp(10px, 0.82vw, 14px);
  font-weight: 700;
  line-height: 1.15;
}

.gasoline-distribution-page .gasoline-plus {
  color: var(--primary);
  font-size: clamp(28px, 3vw, 48px);
  font-weight: 900;
  line-height: 1;
}

.gasoline-distribution-page .gasoline-sales-tables {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
  gap: clamp(0.4rem, 0.8vw, 0.8rem);
  min-width: 0;
}

.gasoline-distribution-page .gasoline-table-shell {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--gasoline-border);
  border-radius: calc(var(--radius) * 0.75);
}

.gasoline-distribution-page .gasoline-data-table {
  width: 100%;
  min-width: 0;
  border-collapse: collapse;
  table-layout: fixed;
  color: var(--foreground);
  font-size: clamp(9px, 0.72vw, 13px);
}

.gasoline-distribution-page .gasoline-data-table th,
.gasoline-distribution-page .gasoline-data-table td {
  height: clamp(27px, 2.1vw, 33px);
  padding: clamp(0.16rem, 0.26vw, 0.28rem) clamp(0.18rem, 0.32vw, 0.36rem);
  border-right: 1px solid var(--gasoline-border);
  border-bottom: 1px solid var(--gasoline-border);
  overflow-wrap: anywhere;
  text-align: center;
  white-space: normal;
  font-weight: 700;
  line-height: 1.08;
}

.gasoline-distribution-page .gasoline-data-table th:last-child,
.gasoline-distribution-page .gasoline-data-table td:last-child {
  border-right: 0;
}

.gasoline-distribution-page .gasoline-data-table tbody tr:last-child td {
  border-bottom: 0;
}

.gasoline-distribution-page .gasoline-data-table th {
  color: var(--foreground);
  font-weight: 900;
}

.gasoline-distribution-page .gasoline-data-table td:first-child {
  font-weight: 900;
}

.gasoline-distribution-page .table-gray th {
  background: var(--gasoline-gray-head);
  color: var(--foreground);
}

.gasoline-distribution-page .table-gray td {
  background: var(--gasoline-gray-body);
}

.gasoline-distribution-page .table-blue th {
  background: var(--gasoline-blue-head);
  color: var(--foreground);
}

.gasoline-distribution-page .table-blue td {
  background: var(--gasoline-blue-body);
}

.gasoline-distribution-page .table-purple th {
  background: var(--gasoline-purple-head);
  color: var(--foreground);
}

.gasoline-distribution-page .table-purple td {
  background: var(--gasoline-purple-body);
}

.gasoline-distribution-page .table-gray .total-row td {
  background: var(--card) !important;
}

.gasoline-distribution-page .table-blue .total-row td {
  background: var(--gasoline-total-blue) !important;
  color: var(--foreground);
  font-weight: 900;
}

.gasoline-distribution-page .table-purple .total-row td {
  background: var(--gasoline-total-purple) !important;
  color: var(--foreground);
  font-weight: 900;
}

.gasoline-distribution-page .gasoline-summary-box {
  display: flex;
  width: fit-content;
  max-width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: clamp(0.5rem, 0.8vw, 0.9rem) auto 0;
  padding: 0.5rem 0.8rem;
  border: 1px solid color-mix(in oklab, var(--primary) 20%, var(--border));
  border-radius: calc(var(--radius) * 0.75);
  background: color-mix(in oklab, var(--primary) 8%, var(--card));
  color: var(--primary);
  font-size: clamp(12px, 0.95vw, 17px);
  line-height: 1.2;
  text-align: center;
}

.gasoline-distribution-page .gasoline-page-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
  color: var(--muted-foreground);
  font-size: clamp(10px, 0.75vw, 13px);
  font-weight: 700;
}

.gasoline-distribution-page .gasoline-page-footer div {
  padding: 0.4rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) * 0.65);
  background: var(--muted);
}

@container (max-width: 1180px) {
  .gasoline-distribution-page .gasoline-diagram {
    grid-template-columns: minmax(0, 1fr) 38px minmax(0, 1fr);
    grid-template-areas:
      "refinery arrow1 mixer"
      "sales sales sales";
  }

  .gasoline-distribution-page .gasoline-arrow-2 {
    display: none;
  }

  .gasoline-distribution-page .gasoline-sales-wrapper {
    margin-top: 0.75rem;
  }

  .gasoline-distribution-page .gasoline-block-title {
    font-size: clamp(14px, 2vw, 20px);
  }

  .gasoline-distribution-page .gasoline-data-table {
    font-size: clamp(10px, 1.18vw, 13px);
  }

  .gasoline-distribution-page .gasoline-data-table th,
  .gasoline-distribution-page .gasoline-data-table td {
    height: 31px;
    padding: 0.28rem 0.36rem;
  }

  .gasoline-distribution-page .gasoline-sales-title h3 {
    font-size: clamp(13px, 1.7vw, 18px);
  }

  .gasoline-distribution-page .gasoline-sales-title p {
    font-size: clamp(10px, 1.25vw, 13px);
  }
}

@container (max-width: 720px) {
  .gasoline-distribution-page .gasoline-diagram {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "refinery"
      "arrow1"
      "mixer"
      "arrow2"
      "sales";
  }

  .gasoline-distribution-page .gasoline-arrow-2 {
    display: block;
  }

  .gasoline-distribution-page .gasoline-flow-arrow {
    width: 24px;
    height: 42px;
    margin: 0.35rem auto;
  }

  .gasoline-distribution-page .gasoline-flow-arrow::before {
    top: 0;
    right: auto;
    bottom: 13px;
    left: 50%;
    width: 5px;
    height: auto;
    transform: translateX(-50%);
  }

  .gasoline-distribution-page .gasoline-flow-arrow::after {
    top: auto;
    right: auto;
    bottom: 0;
    left: 50%;
    border-top: 15px solid var(--gasoline-arrow);
    border-right: 11px solid transparent;
    border-bottom: 0;
    border-left: 11px solid transparent;
    transform: translateX(-50%);
  }

  .gasoline-distribution-page .gasoline-sales-title {
    grid-template-columns: minmax(0, 1fr);
  }

  .gasoline-distribution-page .gasoline-plus {
    margin: -0.15rem 0;
  }

  .gasoline-distribution-page .gasoline-sales-tables {
    grid-template-columns: minmax(0, 1fr);
  }

  .gasoline-distribution-page .gasoline-data-table {
    font-size: 11px;
  }

  .gasoline-distribution-page .gasoline-data-table th,
  .gasoline-distribution-page .gasoline-data-table td {
    height: 32px;
    padding: 0.28rem 0.32rem;
  }

  .gasoline-distribution-page .gasoline-page-footer {
    flex-direction: column;
  }

  .gasoline-distribution-page .gasoline-page-footer div {
    width: 100%;
  }
}
</style>
