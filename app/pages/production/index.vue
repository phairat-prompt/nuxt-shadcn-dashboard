<template>
  <div class="production-page">
    <header class="production-toolbar">
      <div class="min-w-0">
        <h2 class="text-2xl font-bold tracking-tight">
          การผลิตและจำหน่ายดีเซลหมุนเร็ว
        </h2>
      </div>

      <div class="shrink-0">
        <BaseDateRangePicker />
      </div>
    </header>

    <Card class="production-card">
      <CardContent class="p-0">
        <div
          ref="stageWrapper"
          class="stage-wrapper"
        >
          <div
            class="stage-canvas"
            :style="canvasStyle"
          >
            <div
              class="production-stage"
              :style="stageStyle"
            >
              <div class="unit-label">
                หน่วย: ลล. = ล้านลิตร
              </div>

              <!-- ผลิตภัณฑ์อื่นจากการกลั่น -->
              <div class="top-note byproduct-note">
                <div class="top-note-card">
                  <h3>ผลิตภัณฑ์อื่นที่ได้จากการกลั่น</h3>
                  <p>เช่น เบนซิน น้ำมันเตา LPG ยางมะตอย</p>
                </div>

                <div class="arrow-up" />
              </div>

              <!-- เติมไบโอดีเซล -->
              <div class="top-note biodiesel-note">
                <div class="top-note-card">
                  <h3>เติมไบโอดีเซล</h3>

                  <strong>
                    2.189
                    <span>ลล.</span>
                  </strong>
                </div>

                <div class="arrow-down-theme" />
              </div>

              <!-- น้ำมันดิบ -->
              <div class="node crude-node">
                <h2>น้ำมันดิบ</h2>
                <p>เข้ากลั่น</p>

                <strong>
                  176.806
                  <span>ลล.</span>
                </strong>
              </div>

              <div class="h-arrow arrow-crude-refinery" />

              <!-- โรงกลั่น -->
              <div class="node refinery-node">
                <h2>โรงกลั่น</h2>
                <p>ผลิตดีเซลพื้นฐาน</p>

                <strong>
                  72.721
                  <span>ลล.</span>
                </strong>
              </div>

              <div class="h-arrow arrow-refinery-trader" />

              <!-- โรงกลั่นไปส่งออก -->
              <div class="v-arrow arrow-refinery-export" />

              <!-- ไปภาคอุตสาหกรรม -->
              <div class="v-arrow arrow-industry" />

              <!-- ผู้ค้าน้ำมัน -->
              <div class="node trader-node">
                <h2>ผู้ค้าน้ำมันรายใหญ่</h2>
                <p>(โรงกลั่นและผู้ค้าน้ำมันตามมาตรา 7)</p>

                <p class="strong-line">
                  ผลิตดีเซลหมุนเร็ว

                  <strong>
                    31.432
                    <span>ลล.</span>
                  </strong>
                </p>
              </div>

              <div class="h-arrow arrow-trader-customer" />

              <!-- ลูกค้าปลายทาง -->
              <div class="node customer-node">
                <h2>ลูกค้าปลายทาง</h2>
                <p>ปริมาณจำหน่ายดีเซลหมุนเร็ว</p>

                <strong>
                  29.364
                  <span>ลล.</span>
                </strong>

                <p class="avg">
                  (เฉลี่ย ม.ค. – ก.พ. : 69.862 ลล.)
                </p>
              </div>

              <!-- แหล่งน้ำมันดิบ -->
              <section class="source-section">
                <div
                  v-for="item in crudeSources"
                  :key="item.label"
                  class="source-row"
                >
                  <div class="source-label">
                    <span
                      v-if="item.flag"
                      class="flag"
                    >
                      {{ item.flag }}
                    </span>

                    <span>{{ item.label }}</span>

                    <small v-if="item.sub">
                      {{ item.sub }}
                    </small>
                  </div>

                  <div class="bar-track">
                    <div
                      class="bar-fill"
                      :style="{ width: `${item.value}%` }"
                    >
                      {{ item.value }}%
                    </div>
                  </div>
                </div>
              </section>

              <!-- การขนส่ง -->
              <section class="transport-box">
                <h3>การขนส่ง</h3>

                <div
                  v-for="item in transport"
                  :key="item.label"
                  class="transport-row"
                >
                  <span class="transport-icon">
                    {{ item.icon }}
                  </span>

                  <span>{{ item.label }}</span>

                  <strong>
                    {{ item.value }}%
                  </strong>
                </div>
              </section>

              <!-- ภาคอุตสาหกรรม -->
              <section class="industry-box">
                <h2>จำหน่ายภาคอุตสาหกรรม</h2>
                <p>เช่น โรงไฟฟ้า เรือเดินสมุทร</p>

                <strong>
                  0.024
                  <span>ลล.</span>
                </strong>
              </section>

              <!-- ส่งออก -->
              <section class="export-box">
                <div class="truck">
                  🚚
                </div>

                <div>
                  <h2>ส่งออก</h2>
                  <p>สปป.ลาว+เมียนมา</p>

                  <strong>
                    1.645
                    <span>ลล.</span>
                  </strong>
                </div>
              </section>

              <!-- ตารางจำหน่าย -->
              <section class="sales-section">
                <table class="sales-table">
                  <thead>
                    <tr>
                      <th>จำหน่ายให้สาขา</th>
                      <th>เฉลี่ย ม.ค.</th>
                      <th>ปริมาณ</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="row in salesRows"
                      :key="row.name"
                    >
                      <td>
                        <div class="sale-name">
                          <span class="sale-icon">
                            {{ row.icon }}
                          </span>

                          <div>
                            <b>{{ row.name }}</b>

                            <small v-if="row.note">
                              {{ row.note }}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>{{ row.avg }}</td>
                      <td>{{ row.value }}</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

const CANVAS_WIDTH = 1680
const CANVAS_HEIGHT = 860

const MIN_READABLE_SCALE = 0.55
const VIEWPORT_HEIGHT_OFFSET = 190

const stageWrapper = ref<HTMLElement | null>(null)
const scale = ref(1)

let resizeObserver: ResizeObserver | null = null

const updateScale = () => {
  const wrapperWidth
    = stageWrapper.value?.clientWidth || CANVAS_WIDTH

  const availableHeight = Math.max(
    520,
    window.innerHeight - VIEWPORT_HEIGHT_OFFSET,
  )

  const scaleByWidth = wrapperWidth / CANVAS_WIDTH
  const scaleByHeight = availableHeight / CANVAS_HEIGHT

  const fitScale = Math.min(
    scaleByWidth,
    scaleByHeight,
    1,
  )

  scale.value = Math.max(
    fitScale,
    MIN_READABLE_SCALE,
  )
}

const canvasStyle = computed(() => ({
  width: `${CANVAS_WIDTH * scale.value}px`,
  height: `${CANVAS_HEIGHT * scale.value}px`,
}))

const stageStyle = computed(() => ({
  width: `${CANVAS_WIDTH}px`,
  height: `${CANVAS_HEIGHT}px`,
  transform: `scale(${scale.value})`,
}))

onMounted(async () => {
  await nextTick()

  updateScale()

  resizeObserver = new ResizeObserver(() => {
    updateScale()
  })

  if (stageWrapper.value) {
    resizeObserver.observe(stageWrapper.value)
  }

  window.addEventListener('resize', updateScale)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updateScale)
})

const crudeSources = [
  {
    label: 'ตะวันออกกลาง',
    value: 53,
  },
  {
    label: 'อื่น ๆ',
    sub: '(สหรัฐฯ เวสต์แอฟริกา ออสเตรเลีย)',
    value: 27,
  },
  {
    label: 'ตะวันออกไกล',
    value: 11,
  },
  {
    label: 'ไทย',
    value: 9,
    flag: '🇹🇭',
  },
]

const transport = [
  {
    icon: '🚚',
    label: 'ท่อ',
    value: 32.8,
  },
  {
    icon: '🚛',
    label: 'รถ',
    value: 44.7,
  },
  {
    icon: '🚢',
    label: 'เรือ',
    value: 22.5,
  },
]

const salesRows = [
  {
    icon: '⛽',
    name: 'สถานีบริการน้ำมัน',
    note: '',
    avg: '51.300',
    value: '24.566',
  },
  {
    icon: '👷',
    name: 'จ๊อบเบอร์',
    note: '(ผู้ค้าน้ำมันตามมาตรา 10)',
    avg: '7.389',
    value: '2.498',
  },
  {
    icon: '🏭',
    name: 'อุตสาหกรรม',
    note: '',
    avg: '4.000',
    value: '0.583',
  },
  {
    icon: '🚌',
    name: 'ขนส่ง',
    note: 'เช่น รถขนส่ง',
    avg: '1.120',
    value: '0.578',
  },
  {
    icon: '🏛️',
    name: 'ราชการและรัฐวิสาหกิจ',
    note: '',
    avg: '1.180',
    value: '0.678',
  },
  {
    icon: '🚜',
    name: 'อื่น ๆ',
    note: 'เช่น ไฟฟ้า เกษตร ประมง',
    avg: '2.990',
    value: '0.461',
  },
]
</script>

<style scoped>
.production-page {
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 1rem;
  overflow-x: hidden;
  color: var(--foreground);

  --canvas-bg: var(--card);

  --card-bg:
    color-mix(
      in oklab,
      var(--primary) 9%,
      var(--card)
    );

  --soft-bg:
    color-mix(
      in oklab,
      var(--muted) 72%,
      var(--card)
    );

  --table-head: var(--primary);

  --table-row:
    color-mix(
      in oklab,
      var(--muted) 72%,
      var(--card)
    );

  --text-main: var(--foreground);
  --text-muted: var(--muted-foreground);
  --value-color: var(--primary);

  --arrow:
    color-mix(
      in oklab,
      var(--primary) 42%,
      var(--muted-foreground)
    );

  --shadow:
    0 2px 8px
    color-mix(
      in oklab,
      var(--foreground) 15%,
      transparent
    );
}

.production-page,
.production-page * {
  box-sizing: border-box;
}

.production-toolbar {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.production-card {
  min-width: 0;
  overflow: hidden;
  border-color:
    color-mix(
      in oklab,
      var(--border) 88%,
      transparent
    );
  background: var(--card);
  color: var(--card-foreground);
}

.stage-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow: auto;
  border-radius: calc(var(--radius) - 2px);
  background: var(--canvas-bg);
}

.stage-canvas {
  position: relative;
  margin: 0 auto;
  background: var(--canvas-bg);
}

.production-stage {
  --box-w: 350px;
  --box-h: 120px;
  --main-top: 210px;
  --top-box-top: 10px;

  position: absolute;
  inset: 0;
  color: var(--text-main);
  background: var(--canvas-bg);
  font-family: Tahoma, Arial, sans-serif;
  transform-origin: top left;
}

.unit-label {
  position: absolute;
  top: 16px;
  right: 24px;
  color: var(--value-color);
  font-size: 20px;
  font-weight: 800;
}

/* =========================
   Top cards
   ========================= */

.top-note {
  position: absolute;
  width: var(--box-w);
  color: var(--text-main);
  text-align: center;
}

.top-note-card {
  position: relative;
  z-index: 20;
  display: grid;
  width: var(--box-w);
  height: var(--box-h);
  align-content: center;
  padding: 14px 18px;
  border: 1px solid
    color-mix(
      in oklab,
      var(--border) 80%,
      transparent
    );
  border-radius: 8px;
  background: var(--card-bg);
  box-shadow: var(--shadow);
}

.top-note h3 {
  margin: 0;
  color: var(--text-main);
  font-size: 20px;
  font-weight: 900;
  line-height: 1.2;
}

.top-note p {
  margin: 4px 0 0;
  color: var(--text-main);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
}

.top-note strong {
  display: block;
  color: var(--value-color);
  font-size: 30px;
  font-weight: 900;
  line-height: 1.05;
}

.top-note strong span {
  color: var(--text-main);
  font-size: 0.56em;
}

.byproduct-note {
  top: var(--top-box-top);
  left: 445px;
}

.biodiesel-note {
  top: var(--top-box-top);
  left: 880px;
}

/* =========================
   Top arrows
   ========================= */

.arrow-up {
  position: absolute;
  top: 150px;
  left: 50%;
  z-index: 2;
  width: 18px;
  height: 42px;
  border-radius: 2px;
  background: var(--arrow);
  transform: translateX(-50%);
}

.arrow-up::before {
  position: absolute;
  top: -24px;
  left: 50%;
  border-right: 24px solid transparent;
  border-bottom: 28px solid var(--arrow);
  border-left: 24px solid transparent;
  content: "";
  transform: translateX(-50%);
}

.arrow-down-theme {
  position: absolute;
  top: 132px;
  left: 50%;
  z-index: 2;
  width: 18px;
  height: 42px;
  border-radius: 2px;
  background: var(--arrow);
  transform: translateX(-50%);
}

.arrow-down-theme::after {
  position: absolute;
  bottom: -24px;
  left: 50%;
  border-top: 28px solid var(--arrow);
  border-right: 24px solid transparent;
  border-left: 24px solid transparent;
  content: "";
  transform: translateX(-50%);
}

/* =========================
   Main nodes
   ========================= */

.node {
  position: absolute;
  z-index: 10;
  display: grid;
  width: var(--box-w);
  height: var(--box-h);
  align-content: center;
  padding: 14px 18px;
  border: 1px solid
    color-mix(
      in oklab,
      var(--border) 80%,
      transparent
    );
  border-radius: 8px;
  background: var(--card-bg);
  box-shadow: var(--shadow);
  text-align: center;
}

.node h2,
.industry-box h2,
.export-box h2 {
  margin: 0 0 4px;
  color: var(--text-main);
  font-size: 30px;
  font-weight: 900;
  line-height: 1.08;
}

.node p,
.industry-box p,
.export-box p {
  margin: 2px 0;
  color: var(--text-main);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.1;
}

.node strong,
.industry-box strong,
.export-box strong {
  color: var(--value-color);
  font-size: 34px;
  font-weight: 900;
  line-height: 1.05;
}

.node strong span,
.industry-box strong span,
.export-box strong span {
  color: var(--text-main);
  font-size: 0.56em;
}

.crude-node {
  top: var(--main-top);
  left: 10px;
}

.refinery-node {
  top: var(--main-top);
  left: 445px;
}

.trader-node {
  top: var(--main-top);
  left: 880px;
}

.customer-node {
  top: var(--main-top);
  left: 1310px;
}

.trader-node h2,
.customer-node h2 {
  font-size: 28px;
}

.trader-node p,
.customer-node p {
  font-size: 17px;
}

.trader-node .strong-line {
  font-weight: 900;
}

.customer-node .avg {
  font-size: 16px;
  font-weight: 900;
}

/* =========================
   Horizontal arrows
   ========================= */

.h-arrow {
  --arrow-line-height: 14px;
  --arrow-head-width: 34px;
  --arrow-head-height: 40px;

  position: absolute;
  z-index: 1;
  height: var(--arrow-head-height);
}

.h-arrow::before {
  position: absolute;
  top: 50%;
  right: var(--arrow-head-width);
  left: 0;
  height: var(--arrow-line-height);
  background: var(--arrow);
  content: "";
  transform: translateY(-50%);
}

.h-arrow::after {
  position: absolute;
  top: 50%;
  right: 0;
  border-top:
    calc(var(--arrow-head-height) / 2)
    solid transparent;
  border-bottom:
    calc(var(--arrow-head-height) / 2)
    solid transparent;
  border-left:
    var(--arrow-head-width)
    solid var(--arrow);
  content: "";
  transform: translateY(-50%);
}

.arrow-crude-refinery {
  top: 250px;
  left: 350px;
  width: 95px;
}

.arrow-refinery-trader {
  top: 250px;
  left: 785px;
  width: 95px;
}

.arrow-trader-customer {
  top: 250px;
  left: 1220px;
  width: 90px;
}

/* =========================
   Vertical arrows
   ========================= */

.v-arrow {
  --v-arrow-line-width: 18px;
  --v-arrow-head-width: 42px;
  --v-arrow-head-height: 30px;

  position: absolute;
  z-index: 2;
  width: var(--v-arrow-line-width);
  border-radius: 2px;
  background: var(--arrow);
  transform: translateX(-50%);
}

.v-arrow::after {
  position: absolute;
  bottom: calc(var(--v-arrow-head-height) * -1);
  left: 50%;
  border-top:
    var(--v-arrow-head-height)
    solid var(--arrow);
  border-right:
    calc(var(--v-arrow-head-width) / 2)
    solid transparent;
  border-left:
    calc(var(--v-arrow-head-width) / 2)
    solid transparent;
  content: "";
  transform: translateX(-50%);
}

/* ลูกศรลงส่งออก */
.arrow-refinery-export {
  top: 340px;
  left: 525px;
  height: 335px;
}

/* ลูกศรลงภาคอุตสาหกรรม */
.arrow-industry {
  top: 330px;
  left: 680px;
  height: 195px;
}

/* =========================
   Source bars
   ========================= */

.source-section {
  position: absolute;
  top: 365px;
  left: 30px;
  width: 420px;
}

.source-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}

.source-label {
  color: var(--text-main);
  font-size: 21px;
  font-weight: 900;
  line-height: 1.18;
}

.source-label small {
  display: block;
  color: var(--text-muted);
  font-size: 16px;
  font-weight: 800;
}

.flag {
  display: inline-block;
  margin-right: 6px;
  font-size: 34px;
  vertical-align: middle;
}

.bar-track {
  height: 54px;
  overflow: hidden;
  border: 1px solid
    color-mix(
      in oklab,
      var(--border) 85%,
      transparent
    );
  background:
    color-mix(
      in oklab,
      var(--muted) 82%,
      var(--card)
    );
}

.bar-fill {
  display: flex;
  height: 100%;
  min-width: 34px;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  color: var(--primary-foreground);
  font-weight: 900;
}

/* =========================
   Transport
   ========================= */

.transport-box {
  position: absolute;
  top: 350px;
  left: 745px;
  z-index: 6;
  width: 190px;
  min-height: 170px;
  padding: 12px 16px;
  border: 1px solid
    color-mix(
      in oklab,
      var(--border) 88%,
      transparent
    );
  border-radius: 12px;
  background: var(--card-bg);
  box-shadow: var(--shadow);
  text-align: center;
}

.transport-box h3 {
  margin: 0 0 8px;
  color: var(--text-main);
  font-size: 22px;
  font-weight: 900;
}

.transport-row {
  display: grid;
  grid-template-columns: 30px 1fr auto;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  color: var(--text-main);
  font-size: 17px;
  font-weight: 800;
}

.transport-row strong {
  color: var(--value-color);
}

.transport-icon {
  font-size: 25px;
}

/* =========================
   Industry
   ========================= */

.industry-box {
  position: absolute;
  top: 555px;
  left: 560px;
  z-index: 5;
  width: 390px;
  min-height: 108px;
  padding: 14px 18px;
  border: 1px solid
    color-mix(
      in oklab,
      var(--border) 85%,
      transparent
    );
  border-radius: 12px;
  background: var(--soft-bg);
  box-shadow: var(--shadow);
  text-align: center;
}

.industry-box h2 {
  font-size: 30px;
}

.industry-box p {
  color: var(--text-muted);
}

/* =========================
   Export
   ========================= */

.export-box {
  position: absolute;
  top: 705px;
  left: 485px;
  display: flex;
  width: 350px;
  min-height: 110px;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 14px 18px;
  border: 1px solid
    color-mix(
      in oklab,
      var(--border) 85%,
      transparent
    );
  border-radius: 12px;
  background: var(--soft-bg);
  box-shadow: var(--shadow);
  text-align: center;
}

.truck {
  font-size: 58px;
  filter: grayscale(1);
}

.export-box h2 {
  font-size: 32px;
}

/* =========================
   Sales table
   ========================= */

.sales-section {
  position: absolute;
  top: 355px;
  left: 1265px;
  width: 390px;
}

.sales-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  color: var(--text-main);
  font-size: 19px;
  box-shadow: var(--shadow);
}

.sales-table th {
  padding: 10px 8px;
  border: 1px solid
    color-mix(
      in oklab,
      var(--primary) 75%,
      var(--border)
    );
  background: var(--table-head);
  color: var(--primary-foreground);
  font-size: 20px;
  font-weight: 900;
  text-align: right;
}

.sales-table th:first-child {
  width: 51%;
  text-align: center;
}

.sales-table th:nth-child(2) {
  width: 27%;
  text-align: center;
  white-space: nowrap;
}

.sales-table th:nth-child(3) {
  width: 22%;
  text-align: center;
  white-space: nowrap;
}

.sales-table td:nth-child(2),
.sales-table td:nth-child(3) {
  white-space: nowrap;
}

.sales-table td {
  padding: 8px;
  border: 1px solid var(--border);
  color: var(--text-main);
  font-weight: 800;
  text-align: right;
  vertical-align: middle;
}

.sales-table tr:nth-child(odd) td {
  background: var(--table-row);
}

.sales-table tr:nth-child(even) td {
  background: var(--canvas-bg);
}

.sales-table td:first-child {
  text-align: left;
}

.sale-name {
  display: grid;
  grid-template-columns: 42px 1fr;
  align-items: center;
  gap: 8px;
}

.sale-name b {
  display: block;
  font-size: 19px;
  line-height: 1.08;
}

.sale-name small {
  display: block;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.08;
}

.sale-icon {
  font-size: 31px;
  text-align: center;
}

/* =========================
   Theme transitions
   ========================= */

.production-card,
.stage-wrapper,
.stage-canvas,
.production-stage,
.top-note-card,
.node,
.transport-box,
.industry-box,
.export-box,
.bar-track,
.bar-fill,
.sales-table th,
.sales-table td,
.arrow-up,
.arrow-down-theme,
.h-arrow::before,
.v-arrow {
  transition:
    color 200ms ease,
    background-color 200ms ease,
    border-color 200ms ease,
    box-shadow 200ms ease;
}

/* =========================
   Responsive
   ========================= */

@media (max-width: 1200px) {
  .production-page {
    padding: 6px;
  }

  .stage-wrapper {
    border-radius: 10px;
  }
}

@media (max-width: 900px) {
  .production-page {
    padding: 4px;
  }

  .stage-wrapper {
    overflow-x: auto;
    overflow-y: hidden;
    border-radius: 8px;
  }

  .stage-canvas {
    margin: 0;
  }
}
</style>