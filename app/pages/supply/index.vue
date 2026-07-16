<script setup lang="ts">
import { defineComponent, h } from 'vue'

type SaleRow = {
  label: string
  color: string
  diesel: string
  benzine: string
  dieselId?: string
  benzineId?: string
}

const points = {
  A01: '59.677',
  A02: '48.104',
  A03: '57.458',
  A04: '80.815',
  A05: '33.818',
  A06: '78.289',
  A07: '162.689',
  T01: '0.064',
  T02: '0.410',
  T03: '0.969',
  T04: '0.880',
  T05: '19.354',
  T06: '21.624',
} as const

const saleRows: SaleRow[] = [
  {
    label: 'อื่นๆ',
    color: 'greenx',
    diesel: points.T01,
    benzine: points.T02,
    dieselId: 'T-01',
    benzineId: 'T-02',
  },
  {
    label: 'ราชการและรัฐวิสาหกิจ',
    color: 'bluex',
    diesel: points.T03,
    benzine: points.T04,
    dieselId: 'T-03',
    benzineId: 'T-04',
  },
  {
    label: 'ไฟฟ้า',
    color: 'yellowx',
    diesel: '-',
    benzine: '-',
  },
  {
    label: 'อุตสาหกรรม',
    color: 'grayx',
    diesel: points.T01,
    benzine: points.T02,
    dieselId: 'T-01',
    benzineId: 'T-02',
  },
  {
    label: 'ขนส่ง',
    color: 'orangex',
    diesel: points.T03,
    benzine: points.T04,
    dieselId: 'T-03',
    benzineId: 'T-04',
  },
  {
    label: 'สถานีบริการ',
    color: 'orangex',
    diesel: points.T05,
    benzine: points.T06,
    dieselId: 'T-05',
    benzineId: 'T-06',
  },
]

function pointLink(id: string) {
  return `/monitor?point=${encodeURIComponent(id)}`
}

function barHeight(value: string) {
  const max = 22
  const height = 150
  const numericValue = Number(value) || 0

  return `${Math.max((numericValue / max) * height, 3)}px`
}

const Value = defineComponent({
  name: 'PointValue',
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h(
        'a',
        {
          href: pointLink(props.id),
          class:
            'font-extrabold tabular-nums text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:text-primary/80',
          'aria-label': `เปิดรายละเอียด ${props.id}`,
        },
        props.value,
      )
  },
})

const InfoBlock = defineComponent({
  name: 'SupplyInfoBlock',
  props: {
    title: {
      type: String,
      required: true,
    },
    muted: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class: [
            'relative min-w-0 text-foreground',
            props.muted ? 'text-muted-foreground' : '',
          ],
        },
        [
          slots.icon
            ? h(
                'div',
                {
                  class:
                    'mb-1.5 text-[clamp(30px,3vw,54px)] leading-none text-foreground/70',
                },
                slots.icon(),
              )
            : null,

          h(
            'h3',
            {
              class:
                'mb-1.5 mt-0 text-[clamp(14px,0.9vw,16px)] font-extrabold text-foreground',
            },
            props.title,
          ),

          h(
            'ul',
            {
              class:
                'm-0 space-y-0.5 pl-[18px] text-[clamp(13px,0.8vw,15px)] font-semibold leading-[1.45] max-[640px]:pl-4',
            },
            slots.default?.(),
          ),
        ],
      )
  },
})
</script>

<template>
  <div class="overview-dashboard flex w-full flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          ห่วงโซ่อุปทานน้ำมันกลุ่มดีเซลและเบนซิน
        </h2>
      </div>

      <div class="flex items-center gap-2">
        <BaseDateRangePicker />
      </div>
    </div>

    <main class="supply-grid">
      <!-- การจัดหาน้ำมันดิบ -->
      <section class="min-w-0">
        <h2 class="section-title bg-[#09256e]">
          การจัดหาน้ำมันดิบ
        </h2>

        <Card class="dashboard-card text-center">
          <CardContent class="p-0">
            <h3
              class="mb-2 mt-0 text-[clamp(14px,0.9vw,17px)] font-bold text-foreground"
            >
              เข้ากลั่น
              <Value id="A-07" :value="points.A07" />
              ลล.
            </h3>

            <div class="pie-wrap">
              <div class="pie" />

              <span class="pie-label east">
                ตะวันออกไกล: 24.25%
              </span>

              <span class="pie-label middle">
                ตะวันออกกลาง: 19.55%
              </span>

              <span class="pie-label thai">
                ไทย: 23.35%
              </span>

              <span class="pie-label other-label">
                อื่นๆ: 32.84%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card class="dashboard-card">
          <CardContent class="p-0">
            <InfoBlock title="สต๊อก ถังเก็บน้ำมันพื้นฐาน">
              <li>
                ดีเซลพื้นฐาน
                <Value id="A-05" :value="points.A05" />
                ลล.
              </li>

              <li>
                เบนซินพื้นฐาน
                <Value id="A-06" :value="points.A06" />
                ลล.
              </li>

              <li class="muted">
                เฉลี่ย ม.ค. 2569
              </li>

              <li class="muted">
                ดีเซลพื้นฐาน
                <Value id="A-05" :value="points.A05" />
                ลล.
              </li>

              <li class="muted">
                เบนซินพื้นฐาน
                <Value id="A-06" :value="points.A06" />
                ลล.
              </li>
            </InfoBlock>
          </CardContent>
        </Card>

        <Card class="dashboard-card">
          <CardContent class="p-0">
            <InfoBlock title="ส่งออก สปป.ลาว และเมียนมา">
              <li>
                ดีเซลพื้นฐาน
                <Value id="A-05" :value="points.A05" />
                ลล.
              </li>

              <li>
                เบนซินพื้นฐาน
                <Value id="A-06" :value="points.A06" />
                ลล.
              </li>

              <li class="muted">
                เฉลี่ย ม.ค. 2569
              </li>

              <li class="muted">
                ดีเซลพื้นฐาน
                <Value id="A-05" :value="points.A05" />
                ลล.
              </li>

              <li class="muted">
                เบนซินพื้นฐาน
                <Value id="A-06" :value="points.A06" />
                ลล.
              </li>
            </InfoBlock>
          </CardContent>
        </Card>
      </section>

      <!-- การผลิตน้ำมันสำเร็จรูป -->
      <section class="min-w-0">
        <h2 class="section-title bg-[#05008b]">
          การผลิตน้ำมันสำเร็จรูป
        </h2>

        <Card class="dashboard-card">
          <CardContent class="two-column p-0">
            <InfoBlock title="การผลิตของโรงกลั่น">
              <li>
                ดีเซลพื้นฐาน
                <Value id="A-01" :value="points.A01" />
                ลล.

                <span class="muted">
                  (เฉลี่ย มี.ค.
                  <Value id="A-02" :value="points.A02" />
                  ลล.)
                </span>
              </li>

              <li>
                เบนซินพื้นฐาน
                <Value id="A-03" :value="points.A03" />
                ลล.

                <span class="muted">
                  (เฉลี่ย มี.ค.
                  <Value id="A-04" :value="points.A04" />
                  ลล.)
                </span>
              </li>
            </InfoBlock>

            <InfoBlock title="เฉลี่ย ม.ค. 2569" muted>
              <li>
                ดีเซลพื้นฐาน
                <Value id="A-05" :value="points.A05" />
                ลล.
              </li>

              <li>
                เบนซินพื้นฐาน
                <Value id="A-06" :value="points.A06" />
                ลล.
              </li>
            </InfoBlock>
          </CardContent>
        </Card>

        <Card class="dashboard-card">
          <CardContent class="two-column p-0">
            <InfoBlock title="สต๊อก ถังเก็บน้ำมันผสม">
              <li>
                กลุ่มดีเซล
                <Value id="A-05" :value="points.A05" />
                ลล.
              </li>

              <li>
                กลุ่มเบนซิน
                <Value id="A-06" :value="points.A06" />
                ลล.
              </li>
            </InfoBlock>

            <InfoBlock title="เฉลี่ย ม.ค. 2569" muted>
              <li>
                กลุ่มดีเซล
                <Value id="A-05" :value="points.A05" />
                ลล.
              </li>

              <li>
                กลุ่มเบนซิน
                <Value id="A-06" :value="points.A06" />
                ลล.
              </li>
            </InfoBlock>
          </CardContent>
        </Card>

        <!-- แถว Icon การขนส่ง -->
        <div class="flow-row">
          <Icon
            name="i-mdi-truck"
            class="flow-icon"
          />

          <span class="flow-line" />

          <Icon
            name="i-mdi-ferry"
            class="flow-icon"
          />

          <span class="flow-line" />

          <Icon
            name="i-mdi-truck"
            class="flow-icon"
          />

          <span class="flow-line flow-line-long" />

          <Icon
            name="i-mdi-factory"
            class="flow-icon flow-icon-factory"
          />
        </div>

        <Card class="dashboard-card">
          <CardContent class="two-column p-0">
            <InfoBlock title="การผลิต (รวมคลังโรงกลั่น + คลังภูมิภาค)">
              <li>
                กลุ่มดีเซล
                <Value id="A-01" :value="points.A01" />
                ลล.

                <span class="muted">
                  (เฉลี่ย มี.ค.
                  <Value id="A-02" :value="points.A02" />
                  ลล.)
                </span>
              </li>

              <li>
                กลุ่มเบนซิน
                <Value id="A-03" :value="points.A03" />
                ลล.

                <span class="muted">
                  (เฉลี่ย มี.ค.
                  <Value id="A-04" :value="points.A04" />
                  ลล.)
                </span>
              </li>
            </InfoBlock>

            <InfoBlock title="เฉลี่ย ม.ค. 2569" muted>
              <li>
                กลุ่มดีเซล
                <Value id="A-05" :value="points.A05" />
                ลล.
              </li>

              <li>
                กลุ่มเบนซิน
                <Value id="A-06" :value="points.A06" />
                ลล.
              </li>
            </InfoBlock>
          </CardContent>
        </Card>

        <Card class="dashboard-card">
          <CardContent class="lower-grid p-0">
            <InfoBlock title="สต๊อก ผสมน้ำมันชีวภาพ">
              <li>
                ไบโอดีเซล
                <Value id="A-05" :value="points.A05" />
                ลล.
              </li>

              <li>
                เอทานอล
                <Value id="A-06" :value="points.A06" />
                ลล.
              </li>
            </InfoBlock>

            <InfoBlock title="ผู้ค้ามาตรา 7 จำหน่ายไปอุตสาหกรรมและอื่น ๆ">
              <li>
                ดีเซลพื้นฐาน
                <Value id="A-05" :value="points.A05" />
                ลล.
              </li>

              <li class="muted">
                เฉลี่ย ม.ค. 2569
              </li>

              <li class="muted">
                ดีเซลพื้นฐาน
                <Value id="A-05" :value="points.A05" />
                ลล.
              </li>
            </InfoBlock>
          </CardContent>
        </Card>
      </section>

      <!-- การกระจายน้ำมัน -->
      <section class="min-w-0">
        <h2 class="section-title bg-[#087ac0]">
          การกระจายน้ำมัน
        </h2>

        <Card class="dashboard-card min-h-[76px]">
          <CardContent
            class="flex h-full items-center gap-3 p-0 text-[clamp(14px,0.9vw,16px)] font-extrabold"
          >
            <Icon
              name="i-lucide-warehouse"
              class="size-[clamp(34px,3vw,54px)] text-foreground/70"
            />

            <b>คลังภูมิภาค</b>
          </CardContent>
        </Card>

        <Card class="dashboard-card">
          <CardContent class="p-0">
            <InfoBlock title="ผู้ค้าตามมาตรา 7">
              <li>
                ดีเซล
                <Value id="A-01" :value="points.A01" />
                ลล.

                <span class="muted">
                  (เฉลี่ย มี.ค.
                  <Value id="A-02" :value="points.A02" />
                  ลล.)
                </span>
              </li>

              <li>
                เบนซิน
                <Value id="A-03" :value="points.A03" />
                ลล.

                <span class="muted">
                  (เฉลี่ย มี.ค.
                  <Value id="A-04" :value="points.A04" />
                  ลล.)
                </span>
              </li>

              <li class="muted">
                เฉลี่ย ม.ค. 2569
              </li>

              <li class="muted">
                ดีเซล
                <Value id="A-05" :value="points.A05" />
                ลล.
              </li>

              <li class="muted">
                เบนซิน
                <Value id="A-06" :value="points.A06" />
                ลล.
              </li>
            </InfoBlock>

            <div class="mt-6 flex items-center gap-2.5 text-base text-foreground">
              <Icon
                name="i-lucide-user-round"
                class="size-12 text-foreground/70"
              />

              <span>
                <Value id="A-05" :value="points.A05" />
                %
              </span>
            </div>
          </CardContent>
        </Card>

        <Card class="dashboard-card">
          <CardContent class="p-0">
            <InfoBlock title="ผู้ค้าส่ง (Jobber)">
              <li>
                ดีเซล
                <Value id="A-01" :value="points.A01" />
                ลล.

                <span class="muted">
                  (เฉลี่ย มี.ค.
                  <Value id="A-02" :value="points.A02" />
                  ลล.)
                </span>
              </li>

              <li>
                เบนซิน
                <Value id="A-03" :value="points.A03" />
                ลล.

                <span class="muted">
                  (เฉลี่ย มี.ค.
                  <Value id="A-04" :value="points.A04" />
                  ลล.)
                </span>
              </li>

              <li class="muted">
                เฉลี่ย ม.ค. 2569
              </li>

              <li class="muted">
                ดีเซล
                <Value id="A-05" :value="points.A05" />
                ลล.
              </li>

              <li class="muted">
                เบนซิน
                <Value id="A-06" :value="points.A06" />
                ลล.
              </li>
            </InfoBlock>

            <div class="mt-6 flex items-center gap-2.5 text-base text-foreground">
              <Icon
                name="i-lucide-user-round"
                class="size-12 text-foreground/70"
              />

              <span>
                <Value id="A-05" :value="points.A05" />
                %
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      <!-- การจำหน่าย -->
      <section class="sale-section min-w-0">
        <h2 class="section-title bg-[#12aedc]">
          การจำหน่าย
        </h2>

        <Card class="dashboard-card">
          <CardContent class="p-0">
            <div
              class="min-h-[445px] w-full border border-dashed border-foreground/40 p-3"
            >
              <div
                class="flex justify-center gap-[clamp(30px,4vw,70px)] text-center text-[15px]"
              >
                <div>
                  <b class="block text-foreground">
                    ดีเซล
                  </b>

                  <Value id="T-05" :value="points.T05" />
                </div>

                <div>
                  <b class="block text-foreground">
                    เบนซิน
                  </b>

                  <Value id="T-06" :value="points.T06" />
                </div>
              </div>

              <div
                class="my-5 flex h-40 items-end justify-center gap-[clamp(20px,2vw,28px)]"
              >
                <div class="stacked-bar">
                  <span
                    class="seg other"
                    :style="{ height: barHeight(points.T01) }"
                  />

                  <span
                    class="seg gov"
                    :style="{ height: barHeight(points.T03) }"
                  />

                  <span
                    class="seg transport"
                    :style="{ height: barHeight(points.T05) }"
                  />
                </div>

                <div class="stacked-bar">
                  <span
                    class="seg other"
                    :style="{ height: barHeight(points.T02) }"
                  />

                  <span
                    class="seg gov"
                    :style="{ height: barHeight(points.T04) }"
                  />

                  <span
                    class="seg transport"
                    :style="{ height: barHeight(points.T06) }"
                  />
                </div>
              </div>

              <div class="w-full overflow-x-auto">
                <table class="fuel-table">
                  <thead>
                    <tr>
                      <th>หน่วย: ลล.</th>
                      <th>ดีเซล</th>
                      <th>เบนซิน</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="row in saleRows"
                      :key="row.label"
                    >
                      <td>
                        <span class="inline-flex items-center gap-[5px]">
                          <span
                            class="box"
                            :class="row.color"
                          />

                          {{ row.label }}
                        </span>
                      </td>

                      <td>
                        <Value
                          v-if="row.dieselId"
                          :id="row.dieselId"
                          :value="row.diesel"
                        />

                        <span v-else>
                          -
                        </span>
                      </td>

                      <td>
                        <Value
                          v-if="row.benzineId"
                          :id="row.benzineId"
                          :value="row.benzine"
                        />

                        <span v-else>
                          -
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="dashboard-card">
          <CardContent class="p-0">
            <InfoBlock title="รวมจำหน่าย">
              <li>
                ดีเซล
                <Value id="A-01" :value="points.A01" />
                ลล.

                <span class="muted">
                  (เฉลี่ย มี.ค.
                  <Value id="A-02" :value="points.A02" />
                  ลล.)
                </span>
              </li>

              <li>
                เบนซิน
                <Value id="A-03" :value="points.A03" />
                ลล.

                <span class="muted">
                  (เฉลี่ย มี.ค.
                  <Value id="A-04" :value="points.A04" />
                  ลล.)
                </span>
              </li>

              <li class="muted">
                เฉลี่ย ม.ค. 2569
              </li>

              <li class="muted">
                ดีเซล
                <Value id="A-05" :value="points.A05" />
                ลล.
              </li>

              <li class="muted">
                เบนซิน
                <Value id="A-06" :value="points.A06" />
                ลล.
              </li>
            </InfoBlock>
          </CardContent>
        </Card>
      </section>
    </main>
  </div>
</template>

<style scoped>
.overview-dashboard {
  font-family: Tahoma, Arial, sans-serif;
}

.supply-grid {
  display: grid;
  grid-template-columns:
    minmax(280px, 360px)
    minmax(480px, 700px)
    minmax(300px, 400px)
    minmax(300px, 400px);
  align-items: stretch;
  gap: 0.5rem;
  min-width: 0;
}

.section-title {
  display: flex;
  height: clamp(44px, 3.2vw, 60px);
  align-items: center;
  justify-content: center;
  margin: 0;
  border-radius: var(--radius) var(--radius) 0 0;
  color: white;
  font-size: clamp(20px, 1.9vw, 36px);
  font-weight: 800;
  line-height: 1;
  text-align: center;
}

.dashboard-card {
  margin-top: 0.375rem;
  min-width: 0;
  border-color: color-mix(in oklab, var(--border) 86%, transparent);
  border-radius: var(--radius);
  padding: clamp(10px, 1vw, 16px) clamp(12px, 1.2vw, 22px);
  background: var(--card);
  color: var(--card-foreground);
  box-shadow: 0 1px 2px rgb(0 0 0 / 5%);
}

.two-column {
  display: grid;
  grid-template-columns: 1.35fr 0.9fr;
  gap: 1rem;
}

.lower-grid {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 1.25rem;
}

.muted {
  color: var(--muted-foreground);
}

.pie-wrap {
  position: relative;
  width: min(100%, 300px);
  aspect-ratio: 1.12 / 1;
  margin: 0 auto;
}

.pie {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(70vw, 230px);
  max-width: 78%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: conic-gradient(
    #8b6dbc 0 24.25%,
    #ffa14b 24.25% 43.8%,
    #58bfd2 43.8% 67.15%,
    #5b4777 67.15% 100%
  );
}

.pie-label {
  position: absolute;
  color: var(--foreground);
  font-size: clamp(11px, 0.75vw, 13px);
}

.east {
  top: 30%;
  right: 0;
}

.middle {
  right: 4%;
  bottom: 30%;
}

.thai {
  bottom: 10%;
  left: 34%;
}

.other-label {
  top: 38%;
  left: 0;
}

/* =========================
   Flow Icons
   ========================= */

.flow-row {
  display: grid;
  grid-template-columns:
    28px minmax(32px, 1fr)
    28px minmax(32px, 1fr)
    28px minmax(60px, 1.8fr)
    30px;
  align-items: center;
  gap: clamp(7px, 0.8vw, 12px);
  width: 100%;
  min-width: 0;
  margin: 0.4rem 0;
  padding: 9px clamp(12px, 2vw, 24px);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) * 0.35);
  background: color-mix(
    in oklab,
    var(--muted) 55%,
    var(--card)
  );
  color: var(--foreground);
}

.flow-icon {
  display: block;
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  color: var(--foreground);
}

.flow-icon-factory {
  width: 26px;
  height: 26px;
}

.flow-row :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
  color: currentColor;
  fill: currentColor;
}

.flow-line {
  display: block;
  width: 100%;
  min-width: 0;
  height: 2px;
  border-radius: 9999px;
  background: color-mix(
    in oklab,
    var(--foreground) 82%,
    transparent
  );
}

.flow-line-long {
  min-width: 60px;
}

/* =========================
   Sales chart
   ========================= */

.stacked-bar {
  display: flex;
  width: clamp(70px, 5vw, 92px);
  height: 150px;
  flex-direction: column-reverse;
  justify-content: flex-start;
  overflow: hidden;
  border-bottom: 1px solid
    color-mix(in oklab, var(--foreground) 60%, transparent);
}

.seg {
  display: block;
  width: 100%;
  min-height: 3px;
}

.seg.other {
  background: #62b34f;
}

.seg.gov {
  background: #4f73bd;
}

.seg.transport {
  background: #ed7d31;
}

.fuel-table {
  width: 100%;
  min-width: 300px;
  border-collapse: collapse;
  table-layout: fixed;
  color: var(--foreground);
  font-size: clamp(12px, 0.75vw, 13px);
}

.fuel-table th,
.fuel-table td {
  padding: 5px 6px;
  border: 1px solid var(--border);
  background: var(--card);
  text-align: center;
}

.fuel-table th:first-child,
.fuel-table td:first-child {
  font-weight: 700;
  text-align: left;
}

.box {
  display: inline-block;
  width: 11px;
  height: 11px;
  flex: 0 0 11px;
}

.greenx {
  background: #62b34f;
}

.bluex {
  background: #4f73bd;
}

.yellowx {
  background: #ffc000;
}

.grayx {
  background: #a6a6a6;
}

.orangex {
  background: #ed7d31;
}

@media (max-width: 1500px) {
  .supply-grid {
    grid-template-columns: 1fr 1.5fr;
  }

  .sale-section {
    grid-column: span 2;
  }
}

@media (max-width: 1024px) {
  .supply-grid {
    grid-template-columns: 1fr;
  }

  .sale-section {
    grid-column: auto;
  }

  .two-column,
  .lower-grid {
    grid-template-columns: 1fr;
  }

  .flow-row {
    grid-template-columns:
      26px minmax(24px, 1fr)
      26px minmax(24px, 1fr)
      26px minmax(40px, 1.5fr)
      28px;
    padding-inline: 14px;
  }

  .flow-icon {
    width: 22px;
    height: 22px;
  }

  .flow-icon-factory {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 640px) {
  .section-title {
    border-radius:
      calc(var(--radius) * 0.8)
      calc(var(--radius) * 0.8)
      0
      0;
  }

  .flow-row {
    grid-template-columns:
      22px minmax(16px, 1fr)
      22px minmax(16px, 1fr)
      22px minmax(24px, 1.4fr)
      24px;
    gap: 5px;
    padding: 8px 10px;
  }

  .flow-icon {
    width: 19px;
    height: 19px;
  }

  .flow-icon-factory {
    width: 21px;
    height: 21px;
  }

  .flow-line {
    height: 1.5px;
  }

  .stacked-bar {
    width: 4rem;
  }
}
</style>