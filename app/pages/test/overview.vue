<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import 'leaflet/dist/leaflet.css'

type LayerKey = 'depots' | 'ports' | 'pipelines'
type AreaLevel = 'ประเทศ' | 'จังหวัด' | 'อำเภอ' | 'ตำบล'

type Depot = {
  id: number
  name: string
  company: string
  province: string
  district: string
  subdistrict: string
  lat: number
  lng: number
  tanks: number
  capacity: number
  current: number
  deadStock: number
  fuelTypes: string[]
  updatedAt: string
}

type Port = {
  id: number
  name: string
  province: string
  lat: number
  lng: number
  status: 'ใช้งานปกติ' | 'เฝ้าระวัง'
  updatedAt: string
}

type Pipeline = {
  id: number
  name: string
  owner: string
  fuelType: string
  capacity: number
  current: number
  coordinates: [number, number][]
}

type SelectedFeature = {
  type: 'depot' | 'port' | 'pipeline' | 'area'
  title: string
  subtitle: string
  data: Record<string, string | number>
}

const mapElement = ref<HTMLElement | null>(null)
const mapInstance = ref<any>(null)
const leaflet = ref<any>(null)

const selectedLevel = ref<AreaLevel>('ประเทศ')
const selectedProvince = ref('ทั้งหมด')
const selectedDistrict = ref('ทั้งหมด')
const selectedSubdistrict = ref('ทั้งหมด')
const selectedFuel = ref('ทั้งหมด')
const selectedCompany = ref('ทั้งหมด')
const searchText = ref('')
const isSummaryOpen = ref(true)

const visibleLayers = ref<Record<LayerKey, boolean>>({
  depots: true,
  ports: true,
  pipelines: true,
})

const layerGroups = ref<Record<LayerKey, any>>({
  depots: null,
  ports: null,
  pipelines: null,
})

const selectedFeature = ref<SelectedFeature>({
  type: 'area',
  title: 'ภาพรวมประเทศไทย',
  subtitle: 'ข้อมูลตัวอย่างสำหรับออกแบบหน้าจอ',
  data: {
    'คลังน้ำมัน': 122,
    'ท่าเทียบเรือ': 12,
    'โครงข่ายท่อ': 3,
    'จังหวัดที่มีข้อมูล': 44,
  },
})

const depots: Depot[] = [
  {
    id: 1,
    name: 'คลังน้ำมันกรุงเทพ',
    company: 'บริษัท พลังงานไทย จำกัด',
    province: 'กรุงเทพมหานคร',
    district: 'คลองเตย',
    subdistrict: 'คลองเตย',
    lat: 13.7035,
    lng: 100.5764,
    tanks: 18,
    capacity: 420,
    current: 318,
    deadStock: 21,
    fuelTypes: ['ดีเซล', 'แก๊สโซฮอล์'],
    updatedAt: '21 เม.ย. 2569 09:30',
  },
  {
    id: 2,
    name: 'คลังน้ำมันศรีราชา',
    company: 'บริษัท อีสเทิร์น ฟิวเอล จำกัด',
    province: 'ชลบุรี',
    district: 'ศรีราชา',
    subdistrict: 'ทุ่งสุขลา',
    lat: 13.0918,
    lng: 100.9234,
    tanks: 26,
    capacity: 690,
    current: 512,
    deadStock: 34,
    fuelTypes: ['ดีเซล', 'เบนซิน', 'Jet A-1'],
    updatedAt: '21 เม.ย. 2569 09:24',
  },
  {
    id: 3,
    name: 'คลังน้ำมันมาบตาพุด',
    company: 'บริษัท ระยอง เทอร์มินัล จำกัด',
    province: 'ระยอง',
    district: 'เมืองระยอง',
    subdistrict: 'มาบตาพุด',
    lat: 12.6918,
    lng: 101.1502,
    tanks: 22,
    capacity: 585,
    current: 402,
    deadStock: 30,
    fuelTypes: ['ดีเซล', 'Fuel Oil'],
    updatedAt: '21 เม.ย. 2569 09:18',
  },
  {
    id: 4,
    name: 'คลังน้ำมันอยุธยา',
    company: 'บริษัท เซ็นทรัล ไปป์ จำกัด',
    province: 'พระนครศรีอยุธยา',
    district: 'บางปะอิน',
    subdistrict: 'บ้านกรด',
    lat: 14.2271,
    lng: 100.6081,
    tanks: 14,
    capacity: 310,
    current: 236,
    deadStock: 17,
    fuelTypes: ['ดีเซล', 'แก๊สโซฮอล์'],
    updatedAt: '21 เม.ย. 2569 09:10',
  },
  {
    id: 5,
    name: 'คลังน้ำมันลำปาง',
    company: 'บริษัท นอร์ทเทิร์น ฟิวเอล จำกัด',
    province: 'ลำปาง',
    district: 'เมืองลำปาง',
    subdistrict: 'ชมพู',
    lat: 18.2524,
    lng: 99.4631,
    tanks: 10,
    capacity: 190,
    current: 121,
    deadStock: 11,
    fuelTypes: ['ดีเซล'],
    updatedAt: '21 เม.ย. 2569 08:58',
  },
  {
    id: 6,
    name: 'คลังน้ำมันขอนแก่น',
    company: 'บริษัท อีสาน เอนเนอร์จี จำกัด',
    province: 'ขอนแก่น',
    district: 'เมืองขอนแก่น',
    subdistrict: 'บ้านเป็ด',
    lat: 16.4322,
    lng: 102.8236,
    tanks: 12,
    capacity: 245,
    current: 176,
    deadStock: 13,
    fuelTypes: ['ดีเซล', 'แก๊สโซฮอล์'],
    updatedAt: '21 เม.ย. 2569 09:05',
  },
  {
    id: 7,
    name: 'คลังน้ำมันสงขลา',
    company: 'บริษัท เซาท์เทิร์น เทอร์มินัล จำกัด',
    province: 'สงขลา',
    district: 'เมืองสงขลา',
    subdistrict: 'บ่อยาง',
    lat: 7.1988,
    lng: 100.5951,
    tanks: 16,
    capacity: 355,
    current: 248,
    deadStock: 19,
    fuelTypes: ['ดีเซล', 'Jet A-1'],
    updatedAt: '21 เม.ย. 2569 09:12',
  },
]

const ports: Port[] = [
  {
    id: 1,
    name: 'ท่าเทียบเรือศรีราชา',
    province: 'ชลบุรี',
    lat: 13.1514,
    lng: 100.9146,
    status: 'ใช้งานปกติ',
    updatedAt: '21 เม.ย. 2569 09:20',
  },
  {
    id: 2,
    name: 'ท่าเทียบเรือมาบตาพุด',
    province: 'ระยอง',
    lat: 12.6717,
    lng: 101.1436,
    status: 'ใช้งานปกติ',
    updatedAt: '21 เม.ย. 2569 09:15',
  },
  {
    id: 3,
    name: 'ท่าเทียบเรือสงขลา',
    province: 'สงขลา',
    lat: 7.2227,
    lng: 100.5897,
    status: 'เฝ้าระวัง',
    updatedAt: '21 เม.ย. 2569 09:00',
  },
]

const pipelines: Pipeline[] = [
  {
    id: 1,
    name: 'ท่อศรีราชา–กรุงเทพฯ',
    owner: 'บริษัท ท่อส่งพลังงานภาคตะวันออก จำกัด',
    fuelType: 'น้ำมันสำเร็จรูป',
    capacity: 148,
    current: 102,
    coordinates: [
      [13.0918, 100.9234],
      [13.2810, 100.8800],
      [13.5200, 100.7300],
      [13.7035, 100.5764],
    ],
  },
  {
    id: 2,
    name: 'ท่อมาบตาพุด–สระบุรี',
    owner: 'บริษัท โครงข่ายพลังงานไทย จำกัด',
    fuelType: 'น้ำมันสำเร็จรูป',
    capacity: 186,
    current: 135,
    coordinates: [
      [12.6918, 101.1502],
      [13.4100, 101.0200],
      [14.2200, 100.8200],
      [14.5300, 100.9100],
    ],
  },
  {
    id: 3,
    name: 'ท่อบางปะอิน–ภาคเหนือ',
    owner: 'บริษัท เซ็นทรัล ไปป์ จำกัด',
    fuelType: 'ดีเซล',
    capacity: 115,
    current: 71,
    coordinates: [
      [14.2271, 100.6081],
      [15.1200, 100.1800],
      [16.4200, 99.9800],
      [18.2524, 99.4631],
    ],
  },
]

const provinces = computed(() => [
  'ทั้งหมด',
  ...new Set(depots.map(item => item.province)),
])

const districts = computed(() => {
  if (selectedProvince.value === 'ทั้งหมด')
    return ['ทั้งหมด']

  return [
    'ทั้งหมด',
    ...new Set(
      depots
        .filter(item => item.province === selectedProvince.value)
        .map(item => item.district),
    ),
  ]
})

const subdistricts = computed(() => {
  if (selectedDistrict.value === 'ทั้งหมด')
    return ['ทั้งหมด']

  return [
    'ทั้งหมด',
    ...new Set(
      depots
        .filter(item => item.district === selectedDistrict.value)
        .map(item => item.subdistrict),
    ),
  ]
})

const companies = computed(() => [
  'ทั้งหมด',
  ...new Set(depots.map(item => item.company)),
])

const fuelTypes = computed(() => [
  'ทั้งหมด',
  ...new Set(depots.flatMap(item => item.fuelTypes)),
])

const filteredDepots = computed(() => {
  const keyword = searchText.value.trim().toLowerCase()

  return depots.filter((item) => {
    const matchesProvince =
      selectedProvince.value === 'ทั้งหมด'
      || item.province === selectedProvince.value

    const matchesDistrict =
      selectedDistrict.value === 'ทั้งหมด'
      || item.district === selectedDistrict.value

    const matchesSubdistrict =
      selectedSubdistrict.value === 'ทั้งหมด'
      || item.subdistrict === selectedSubdistrict.value

    const matchesCompany =
      selectedCompany.value === 'ทั้งหมด'
      || item.company === selectedCompany.value

    const matchesFuel =
      selectedFuel.value === 'ทั้งหมด'
      || item.fuelTypes.includes(selectedFuel.value)

    const matchesSearch =
      !keyword
      || [
        item.name,
        item.company,
        item.province,
        item.district,
        item.subdistrict,
        ...item.fuelTypes,
      ].some(value => value.toLowerCase().includes(keyword))

    return (
      matchesProvince
      && matchesDistrict
      && matchesSubdistrict
      && matchesCompany
      && matchesFuel
      && matchesSearch
    )
  })
})

const filteredPorts = computed(() => {
  if (selectedProvince.value === 'ทั้งหมด')
    return ports

  return ports.filter(item => item.province === selectedProvince.value)
})

const summary = computed(() => {
  const capacity = filteredDepots.value.reduce(
    (sum, item) => sum + item.capacity,
    0,
  )
  const current = filteredDepots.value.reduce(
    (sum, item) => sum + item.current,
    0,
  )
  const tanks = filteredDepots.value.reduce(
    (sum, item) => sum + item.tanks,
    0,
  )
  const deadStock = filteredDepots.value.reduce(
    (sum, item) => sum + item.deadStock,
    0,
  )

  return {
    depots: filteredDepots.value.length,
    ports: filteredPorts.value.length,
    pipelines: pipelines.length,
    tanks,
    capacity,
    current,
    deadStock,
    utilization: capacity > 0 ? (current / capacity) * 100 : 0,
  }
})

const provinceRanking = computed(() => {
  const totals = new Map<string, number>()

  filteredDepots.value.forEach((item) => {
    totals.set(
      item.province,
      (totals.get(item.province) ?? 0) + item.current,
    )
  })

  return [...totals.entries()]
    .map(([province, value]) => ({ province, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
})

const maxProvinceVolume = computed(() =>
  Math.max(...provinceRanking.value.map(item => item.value), 1),
)

function formatNumber(value: number) {
  return value.toLocaleString('en-US', {
    maximumFractionDigits: 1,
  })
}

function resetFilters() {
  selectedLevel.value = 'ประเทศ'
  selectedProvince.value = 'ทั้งหมด'
  selectedDistrict.value = 'ทั้งหมด'
  selectedSubdistrict.value = 'ทั้งหมด'
  selectedFuel.value = 'ทั้งหมด'
  selectedCompany.value = 'ทั้งหมด'
  searchText.value = ''
}

function selectDepot(item: Depot) {
  selectedFeature.value = {
    type: 'depot',
    title: item.name,
    subtitle: `${item.subdistrict} · ${item.district} · ${item.province}`,
    data: {
      'บริษัทเจ้าของ': item.company,
      'จำนวนถัง': `${item.tanks} ถัง`,
      'ความจุรวม': `${formatNumber(item.capacity)} ล้านลิตร`,
      'ปริมาณปัจจุบัน': `${formatNumber(item.current)} ล้านลิตร`,
      'Dead stock': `${formatNumber(item.deadStock)} ล้านลิตร`,
      'ชนิดน้ำมัน': item.fuelTypes.join(', '),
      'อัปเดตล่าสุด': item.updatedAt,
    },
  }
  isSummaryOpen.value = true
}

function selectPort(item: Port) {
  selectedFeature.value = {
    type: 'port',
    title: item.name,
    subtitle: item.province,
    data: {
      'สถานะ': item.status,
      'ประเภท': 'ท่าเทียบเรือน้ำมันเชื้อเพลิง',
      'อัปเดตล่าสุด': item.updatedAt,
    },
  }
  isSummaryOpen.value = true
}

function selectPipeline(item: Pipeline) {
  selectedFeature.value = {
    type: 'pipeline',
    title: item.name,
    subtitle: item.owner,
    data: {
      'ชนิดน้ำมัน': item.fuelType,
      'ความจุสูงสุด': `${formatNumber(item.capacity)} ล้านลิตร`,
      'ปริมาณในท่อ': `${formatNumber(item.current)} ล้านลิตร`,
      'อัตราการใช้': `${((item.current / item.capacity) * 100).toFixed(1)}%`,
    },
  }
  isSummaryOpen.value = true
}

function toggleLayer(key: LayerKey) {
  visibleLayers.value[key] = !visibleLayers.value[key]

  const map = mapInstance.value
  const group = layerGroups.value[key]

  if (!map || !group)
    return

  if (visibleLayers.value[key])
    group.addTo(map)
  else
    map.removeLayer(group)
}

async function renderMapLayers() {
  const L = leaflet.value
  const map = mapInstance.value

  if (!L || !map)
    return

  Object.values(layerGroups.value).forEach((group) => {
    if (group && map.hasLayer(group))
      map.removeLayer(group)
  })

  const depotGroup = L.layerGroup()
  const portGroup = L.layerGroup()
  const pipelineGroup = L.layerGroup()

  filteredDepots.value.forEach((item) => {
    const utilization = item.current / item.capacity
    const markerColor =
      utilization >= 0.8
        ? '#f59e0b'
        : utilization < 0.45
          ? '#ef4444'
          : '#2563eb'

    const marker = L.circleMarker([item.lat, item.lng], {
      radius: 9,
      color: '#ffffff',
      weight: 2,
      fillColor: markerColor,
      fillOpacity: 0.92,
    })

    marker.bindTooltip(
      `<strong>${item.name}</strong><br>${item.province}<br>${formatNumber(item.current)} / ${formatNumber(item.capacity)} ล้านลิตร`,
      { direction: 'top', offset: [0, -8] },
    )

    marker.on('click', () => selectDepot(item))
    marker.addTo(depotGroup)
  })

  filteredPorts.value.forEach((item) => {
    const icon = L.divIcon({
      className: 'custom-port-marker',
      html: `
        <div class="port-marker-shell">
          <span>⚓</span>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    })

    const marker = L.marker([item.lat, item.lng], { icon })
    marker.bindTooltip(
      `<strong>${item.name}</strong><br>${item.province}<br>${item.status}`,
      { direction: 'top', offset: [0, -8] },
    )
    marker.on('click', () => selectPort(item))
    marker.addTo(portGroup)
  })

  pipelines.forEach((item) => {
    const line = L.polyline(item.coordinates, {
      color: '#7c3aed',
      weight: 5,
      opacity: 0.82,
      dashArray: '10 8',
    })

    line.bindTooltip(
      `<strong>${item.name}</strong><br>${item.owner}`,
      { sticky: true },
    )
    line.on('click', () => selectPipeline(item))
    line.addTo(pipelineGroup)
  })

  layerGroups.value = {
    depots: depotGroup,
    ports: portGroup,
    pipelines: pipelineGroup,
  }

  if (visibleLayers.value.depots)
    depotGroup.addTo(map)

  if (visibleLayers.value.ports)
    portGroup.addTo(map)

  if (visibleLayers.value.pipelines)
    pipelineGroup.addTo(map)

  const points = filteredDepots.value.map(item => [item.lat, item.lng])
  if (points.length > 0) {
    const bounds = L.latLngBounds(points)
    map.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: selectedProvince.value === 'ทั้งหมด' ? 6 : 10,
    })
  }
}

async function initializeMap() {
  if (!mapElement.value || mapInstance.value || !import.meta.client)
    return

  const L = await import('leaflet')
  leaflet.value = L

  const map = L.map(mapElement.value, {
    zoomControl: false,
    attributionControl: false,
    minZoom: 5,
    maxZoom: 15,
  }).setView([13.2, 101.0], 6)

  L.control.zoom({ position: 'bottomright' }).addTo(map)

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    },
  ).addTo(map)

  mapInstance.value = map
  await renderMapLayers()
}

onMounted(async () => {
  await nextTick()
  await initializeMap()
})

onBeforeUnmount(() => {
  mapInstance.value?.remove()
  mapInstance.value = null
})

watch(
  [
    selectedProvince,
    selectedDistrict,
    selectedSubdistrict,
    selectedFuel,
    selectedCompany,
    searchText,
  ],
  async () => {
    if (selectedProvince.value === 'ทั้งหมด') {
      selectedDistrict.value = 'ทั้งหมด'
      selectedSubdistrict.value = 'ทั้งหมด'
    }

    await nextTick()
    await renderMapLayers()
  },
)

watch(selectedDistrict, (value) => {
  if (value === 'ทั้งหมด')
    selectedSubdistrict.value = 'ทั้งหมด'
})
</script>

<template>
  <div class="national-overview-dashboard w-full min-w-0 space-y-4">
    <!-- Header -->
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <div class="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            รายงาน 4.5.2 (11)
          </Badge>

          <Badge variant="outline">
            ภาพรวมทั้งประเทศ
          </Badge>
        </div>

        <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
          รายงานแสดงผลภาพรวมโครงสร้างพื้นฐานน้ำมันเชื้อเพลิง
        </h1>

        <p class="mt-1 text-sm text-muted-foreground">
          แสดงข้อมูลคลังน้ำมัน ท่าเทียบเรือ และท่อขนส่ง พร้อม Drill down
          ระดับจังหวัด อำเภอ และตำบล
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <BaseDateRangePicker />

        <Button variant="outline">
          <Icon name="i-lucide-download" class="mr-2" size="17" />
          ส่งออก
        </Button>

        <Button>
          <Icon name="i-lucide-refresh-cw" class="mr-2" size="17" />
          รีเฟรช
        </Button>
      </div>
    </header>

    <!-- KPI -->
    <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card class="gap-0 rounded-2xl py-0 shadow-sm">
        <CardContent class="p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">
                คลังน้ำมัน
              </p>
              <p class="mt-1 text-3xl font-bold tabular-nums">
                {{ selectedProvince === 'ทั้งหมด' ? 122 : summary.depots }}
              </p>
              <p class="mt-1 text-xs text-muted-foreground">
                {{ summary.tanks }} ถังในพื้นที่ที่เลือก
              </p>
            </div>

            <div class="kpi-icon bg-primary/10 text-primary">
              <Icon name="i-lucide-warehouse" size="26" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="gap-0 rounded-2xl py-0 shadow-sm">
        <CardContent class="p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">
                ท่าเทียบเรือ
              </p>
              <p class="mt-1 text-3xl font-bold tabular-nums">
                {{ selectedProvince === 'ทั้งหมด' ? 12 : summary.ports }}
              </p>
              <p class="mt-1 text-xs text-muted-foreground">
                จุดรับและขนถ่ายน้ำมัน
              </p>
            </div>

            <div class="kpi-icon bg-sky-500/10 text-sky-600">
              <Icon name="i-lucide-anchor" size="26" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="gap-0 rounded-2xl py-0 shadow-sm">
        <CardContent class="p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">
                โครงข่ายท่อขนส่ง
              </p>
              <p class="mt-1 text-3xl font-bold tabular-nums">
                {{ summary.pipelines }}
              </p>
              <p class="mt-1 text-xs text-muted-foreground">
                เส้นทางหลัก
              </p>
            </div>

            <div class="kpi-icon bg-violet-500/10 text-violet-600">
              <Icon name="i-lucide-route" size="26" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="gap-0 rounded-2xl py-0 shadow-sm">
        <CardContent class="p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm text-muted-foreground">
                ปริมาณน้ำมันในคลัง
              </p>
              <p class="mt-1 text-3xl font-bold tabular-nums">
                {{ formatNumber(summary.current) }}
              </p>
              <p class="mt-1 text-xs text-muted-foreground">
                ล้านลิตร · ใช้ความจุ {{ summary.utilization.toFixed(1) }}%
              </p>
            </div>

            <div class="kpi-icon bg-emerald-500/10 text-emerald-600">
              <Icon name="i-lucide-droplets" size="26" />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- Filter bar -->
    <Card class="gap-0 rounded-2xl py-0 shadow-sm">
      <CardContent class="p-4">
        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          <label class="filter-field">
            <span>ระดับข้อมูล</span>
            <select v-model="selectedLevel">
              <option>ประเทศ</option>
              <option>จังหวัด</option>
              <option>อำเภอ</option>
              <option>ตำบล</option>
            </select>
          </label>

          <label class="filter-field">
            <span>จังหวัด</span>
            <select v-model="selectedProvince">
              <option
                v-for="item in provinces"
                :key="item"
                :value="item"
              >
                {{ item }}
              </option>
            </select>
          </label>

          <label class="filter-field">
            <span>อำเภอ</span>
            <select
              v-model="selectedDistrict"
              :disabled="selectedProvince === 'ทั้งหมด'"
            >
              <option
                v-for="item in districts"
                :key="item"
                :value="item"
              >
                {{ item }}
              </option>
            </select>
          </label>

          <label class="filter-field">
            <span>ตำบล</span>
            <select
              v-model="selectedSubdistrict"
              :disabled="selectedDistrict === 'ทั้งหมด'"
            >
              <option
                v-for="item in subdistricts"
                :key="item"
                :value="item"
              >
                {{ item }}
              </option>
            </select>
          </label>

          <label class="filter-field">
            <span>ชนิดน้ำมัน</span>
            <select v-model="selectedFuel">
              <option
                v-for="item in fuelTypes"
                :key="item"
                :value="item"
              >
                {{ item }}
              </option>
            </select>
          </label>

          <label class="filter-field">
            <span>บริษัท</span>
            <select v-model="selectedCompany">
              <option
                v-for="item in companies"
                :key="item"
                :value="item"
              >
                {{ item }}
              </option>
            </select>
          </label>

          <label class="filter-field">
            <span>ค้นหา</span>
            <div class="search-input">
              <Icon name="i-lucide-search" size="16" />
              <input
                v-model="searchText"
                type="search"
                placeholder="คลัง บริษัท หรือพื้นที่"
              >
            </div>
          </label>
        </div>

        <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p class="text-xs text-muted-foreground">
            พบ {{ filteredDepots.length }} คลังจากข้อมูลตัวอย่าง
          </p>

          <Button variant="ghost" size="sm" @click="resetFilters">
            <Icon name="i-lucide-rotate-ccw" class="mr-2" size="15" />
            ล้างตัวกรอง
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <section class="grid min-w-0 gap-4 2xl:grid-cols-[280px_minmax(0,1fr)_340px]">
      <!-- Layers -->
      <Card class="order-2 gap-0 rounded-2xl py-0 shadow-sm 2xl:order-1">
        <CardHeader class="px-4 pb-2 pt-4">
          <CardTitle class="text-base">
            ชั้นข้อมูลแผนที่
          </CardTitle>

          <CardDescription>
            เปิดหรือปิดข้อมูลที่ต้องการแสดง
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-3 px-4 pb-4 pt-1">
          <button
            class="layer-toggle"
            :class="{ active: visibleLayers.depots }"
            @click="toggleLayer('depots')"
          >
            <span class="layer-icon bg-primary/10 text-primary">
              <Icon name="i-lucide-warehouse" size="18" />
            </span>

            <span class="min-w-0 flex-1 text-left">
              <strong>คลังน้ำมัน</strong>
              <small>{{ filteredDepots.length }} จุดบนแผนที่</small>
            </span>

            <span class="switch-dot" />
          </button>

          <button
            class="layer-toggle"
            :class="{ active: visibleLayers.ports }"
            @click="toggleLayer('ports')"
          >
            <span class="layer-icon bg-sky-500/10 text-sky-600">
              <Icon name="i-lucide-anchor" size="18" />
            </span>

            <span class="min-w-0 flex-1 text-left">
              <strong>ท่าเทียบเรือ</strong>
              <small>{{ filteredPorts.length }} จุดบนแผนที่</small>
            </span>

            <span class="switch-dot" />
          </button>

          <button
            class="layer-toggle"
            :class="{ active: visibleLayers.pipelines }"
            @click="toggleLayer('pipelines')"
          >
            <span class="layer-icon bg-violet-500/10 text-violet-600">
              <Icon name="i-lucide-route" size="18" />
            </span>

            <span class="min-w-0 flex-1 text-left">
              <strong>ท่อขนส่งน้ำมัน</strong>
              <small>{{ pipelines.length }} เส้นทาง</small>
            </span>

            <span class="switch-dot" />
          </button>

          <Separator />

          <div>
            <p class="mb-2 text-xs font-medium text-muted-foreground">
              คำอธิบายสถานะคลัง
            </p>

            <div class="space-y-2 text-xs">
              <div class="legend-item">
                <span class="status-dot bg-primary" />
                ปริมาณปกติ
              </div>
              <div class="legend-item">
                <span class="status-dot bg-amber-500" />
                ใช้ความจุสูง
              </div>
              <div class="legend-item">
                <span class="status-dot bg-red-500" />
                ปริมาณต่ำ
              </div>
            </div>
          </div>

          <Separator />

          <div class="rounded-xl bg-muted/50 p-3">
            <p class="text-xs text-muted-foreground">
              ระดับที่กำลังดู
            </p>
            <p class="mt-1 font-semibold">
              {{ selectedLevel }}
            </p>
            <p class="mt-1 text-xs text-muted-foreground">
              {{
                selectedProvince === 'ทั้งหมด'
                  ? 'ประเทศไทย'
                  : selectedProvince
              }}
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Leaflet map -->
      <Card class="order-1 min-w-0 gap-0 overflow-hidden rounded-2xl py-0 shadow-sm 2xl:order-2">
        <CardHeader class="px-4 pb-3 pt-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle class="text-lg">
                แผนที่โครงสร้างพื้นฐานน้ำมันเชื้อเพลิง
              </CardTitle>

              <CardDescription>
                คลิก Marker หรือเส้นท่อเพื่อดูรายละเอียด
              </CardDescription>
            </div>

            <Badge variant="outline">
              OpenStreetMap
            </Badge>
          </div>
        </CardHeader>

        <CardContent class="px-4 pb-4 pt-0">
          <ClientOnly>
            <div ref="mapElement" class="national-map" />

            <template #fallback>
              <div class="map-loading">
                <Icon
                  name="i-lucide-loader-circle"
                  class="animate-spin"
                  size="28"
                />
                กำลังโหลดแผนที่
              </div>
            </template>
          </ClientOnly>
        </CardContent>
      </Card>

      <!-- Detail panel -->
      <Card
        v-if="isSummaryOpen"
        class="order-3 gap-0 rounded-2xl py-0 shadow-sm"
      >
        <CardHeader class="px-4 pb-3 pt-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="mb-2 flex items-center gap-2">
                <Badge variant="secondary">
                  {{
                    selectedFeature.type === 'depot'
                      ? 'คลังน้ำมัน'
                      : selectedFeature.type === 'port'
                        ? 'ท่าเทียบเรือ'
                        : selectedFeature.type === 'pipeline'
                          ? 'ท่อขนส่ง'
                          : 'พื้นที่'
                  }}
                </Badge>
              </div>

              <CardTitle class="text-lg">
                {{ selectedFeature.title }}
              </CardTitle>

              <CardDescription>
                {{ selectedFeature.subtitle }}
              </CardDescription>
            </div>

            <Button
              variant="ghost"
              size="icon"
              @click="isSummaryOpen = false"
            >
              <Icon name="i-lucide-x" size="18" />
            </Button>
          </div>
        </CardHeader>

        <CardContent class="px-4 pb-4 pt-0">
          <dl class="detail-list">
            <div
              v-for="(value, label) in selectedFeature.data"
              :key="label"
            >
              <dt>{{ label }}</dt>
              <dd>{{ value }}</dd>
            </div>
          </dl>

          <div class="mt-4 grid gap-2">
            <Button
              v-if="selectedFeature.type === 'depot'"
              class="w-full"
            >
              ดูรายงานข้อมูลคลัง
              <Icon name="i-lucide-arrow-right" class="ml-2" size="16" />
            </Button>

            <Button
              v-if="selectedFeature.type === 'pipeline'"
              class="w-full"
            >
              ดูรายงานปริมาณในท่อ
              <Icon name="i-lucide-arrow-right" class="ml-2" size="16" />
            </Button>

            <Button variant="outline" class="w-full">
              <Icon name="i-lucide-file-down" class="mr-2" size="16" />
              ดาวน์โหลดรายละเอียด
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button
        v-else
        variant="outline"
        class="order-3 h-fit"
        @click="isSummaryOpen = true"
      >
        <Icon name="i-lucide-panel-right-open" class="mr-2" size="17" />
        เปิดแผงรายละเอียด
      </Button>
    </section>

    <!-- Bottom charts -->
    <section class="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <Card class="min-w-0 gap-0 rounded-2xl py-0 shadow-sm">
        <CardHeader class="px-4 pb-3 pt-4">
          <CardTitle class="text-lg">
            ปริมาณน้ำมันรายจังหวัด
          </CardTitle>

          <CardDescription>
            เรียงตามปริมาณน้ำมันในคลังจากมากไปน้อย
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-3 px-4 pb-4 pt-0">
          <div
            v-for="item in provinceRanking"
            :key="item.province"
            class="province-bar-row"
          >
            <span>{{ item.province }}</span>

            <div class="province-bar-track">
              <div
                class="province-bar-value"
                :style="{
                  width: `${(item.value / maxProvinceVolume) * 100}%`,
                }"
              />
            </div>

            <strong class="tabular-nums">
              {{ formatNumber(item.value) }}
            </strong>
          </div>
        </CardContent>
      </Card>

      <Card class="min-w-0 gap-0 overflow-hidden rounded-2xl py-0 shadow-sm">
        <CardHeader class="px-4 pb-3 pt-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle class="text-lg">
                คลังน้ำมันในพื้นที่ที่เลือก
              </CardTitle>

              <CardDescription>
                แสดงรายการที่ผ่านตัวกรอง
              </CardDescription>
            </div>

            <Badge variant="secondary">
              {{ filteredDepots.length }} รายการ
            </Badge>
          </div>
        </CardHeader>

        <CardContent class="p-0">
          <div class="overview-table-scroll">
            <table class="overview-table">
              <thead>
                <tr>
                  <th>คลังน้ำมัน</th>
                  <th>จังหวัด</th>
                  <th>ปริมาณ</th>
                  <th>การใช้ความจุ</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in filteredDepots"
                  :key="item.id"
                  @click="selectDepot(item)"
                >
                  <td>
                    <p class="font-medium">
                      {{ item.name }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      {{ item.company }}
                    </p>
                  </td>
                  <td>{{ item.province }}</td>
                  <td class="font-semibold tabular-nums">
                    {{ formatNumber(item.current) }}
                  </td>
                  <td>
                    <div class="capacity-cell">
                      <div class="capacity-track">
                        <div
                          class="capacity-value"
                          :style="{
                            width: `${(item.current / item.capacity) * 100}%`,
                          }"
                        />
                      </div>
                      <span>
                        {{ ((item.current / item.capacity) * 100).toFixed(0) }}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>

<style scoped>
.national-overview-dashboard :deep([data-slot='card-header']) {
  gap: 0.25rem;
}

.kpi-icon {
  display: flex;
  width: 3rem;
  height: 3rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
}

.filter-field {
  display: grid;
  min-width: 0;
  gap: 0.4rem;
}

.filter-field > span {
  color: var(--muted-foreground);
  font-size: 0.72rem;
  font-weight: 500;
}

.filter-field select,
.search-input {
  width: 100%;
  height: 2.5rem;
  border: 1px solid var(--input);
  border-radius: 0.65rem;
  background: var(--background);
  color: var(--foreground);
  font-size: 0.8rem;
}

.filter-field select {
  padding: 0 0.75rem;
}

.filter-field select:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.search-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.7rem;
}

.search-input input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: inherit;
}

/* Layers */
.layer-toggle {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem;
  border: 1px solid var(--border);
  border-radius: 0.85rem;
  background: var(--card);
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.layer-toggle:hover {
  background: var(--muted);
}

.layer-toggle.active {
  border-color:
    color-mix(
      in oklab,
      var(--primary) 42%,
      var(--border)
    );
  background:
    color-mix(
      in oklab,
      var(--primary) 6%,
      var(--card)
    );
}

.layer-icon {
  display: flex;
  width: 2.3rem;
  height: 2.3rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
}

.layer-toggle strong,
.layer-toggle small {
  display: block;
}

.layer-toggle strong {
  color: var(--foreground);
  font-size: 0.8rem;
}

.layer-toggle small {
  margin-top: 0.15rem;
  color: var(--muted-foreground);
  font-size: 0.68rem;
}

.switch-dot {
  position: relative;
  width: 2rem;
  height: 1.1rem;
  flex: 0 0 auto;
  border-radius: 9999px;
  background: var(--muted);
  transition: background 0.15s ease;
}

.switch-dot::after {
  position: absolute;
  top: 0.15rem;
  left: 0.15rem;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 9999px;
  background: var(--background);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.22);
  content: '';
  transition: transform 0.15s ease;
}

.layer-toggle.active .switch-dot {
  background: var(--primary);
}

.layer-toggle.active .switch-dot::after {
  transform: translateX(0.9rem);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--muted-foreground);
}

.status-dot {
  width: 0.65rem;
  height: 0.65rem;
  flex: 0 0 auto;
  border-radius: 9999px;
}

/* Map */
.national-map,
.map-loading {
  width: 100%;
  height: clamp(520px, 62vh, 760px);
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 1rem;
}

.map-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  background: var(--muted);
  color: var(--muted-foreground);
}

.national-overview-dashboard :deep(.leaflet-container) {
  background: var(--muted);
  font-family: inherit;
}

.national-overview-dashboard :deep(.leaflet-control-zoom a) {
  border-color: var(--border);
  background: var(--card);
  color: var(--foreground);
}

.national-overview-dashboard :deep(.leaflet-tooltip) {
  border: 1px solid var(--border);
  border-radius: 0.65rem;
  background: var(--popover);
  color: var(--popover-foreground);
  box-shadow: 0 8px 25px rgb(0 0 0 / 0.14);
  font-family: inherit;
  font-size: 0.75rem;
}

.national-overview-dashboard :deep(.custom-port-marker) {
  border: 0;
  background: transparent;
}

.national-overview-dashboard :deep(.port-marker-shell) {
  display: flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  border-radius: 9999px;
  background: #0284c7;
  color: white;
  box-shadow: 0 4px 12px rgb(2 132 199 / 0.35);
  font-size: 17px;
}

/* Detail */
.detail-list {
  display: grid;
  gap: 0;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 0.85rem;
}

.detail-list > div {
  display: grid;
  grid-template-columns: minmax(105px, 0.8fr) minmax(0, 1.2fr);
  gap: 0.75rem;
  padding: 0.7rem 0.8rem;
  border-bottom: 1px solid var(--border);
}

.detail-list > div:last-child {
  border-bottom: 0;
}

.detail-list dt {
  color: var(--muted-foreground);
  font-size: 0.72rem;
}

.detail-list dd {
  min-width: 0;
  margin: 0;
  color: var(--foreground);
  font-size: 0.75rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

/* Province bars */
.province-bar-row {
  display: grid;
  grid-template-columns: minmax(120px, 0.55fr) minmax(150px, 1.45fr) 70px;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.8rem;
}

.province-bar-track,
.capacity-track {
  overflow: hidden;
  border-radius: 9999px;
  background: var(--muted);
}

.province-bar-track {
  height: 0.65rem;
}

.province-bar-value,
.capacity-value {
  height: 100%;
  border-radius: inherit;
  background: var(--primary);
}

.province-bar-row strong {
  text-align: right;
}

/* Table */
.overview-table-scroll {
  width: 100%;
  max-height: 410px;
  overflow: auto;
}

.overview-table {
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.overview-table th,
.overview-table td {
  padding: 0.75rem 0.9rem;
  border-bottom: 1px solid var(--border);
  text-align: left;
  vertical-align: middle;
}

.overview-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--card);
  color: var(--muted-foreground);
  font-weight: 500;
}

.overview-table tbody tr {
  cursor: pointer;
}

.overview-table tbody tr:hover td {
  background: var(--muted);
}

.capacity-cell {
  display: grid;
  min-width: 150px;
  grid-template-columns: minmax(90px, 1fr) 40px;
  align-items: center;
  gap: 0.6rem;
}

.capacity-track {
  height: 0.45rem;
}

@media (max-width: 768px) {
  .national-map,
  .map-loading {
    height: 510px;
  }

  .province-bar-row {
    grid-template-columns: 105px minmax(100px, 1fr) 55px;
  }
}
</style>
