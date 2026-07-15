<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

definePageMeta({
  title: 'Map',
})

type StorageLocation = {
  uuid: string
  depotId: number | null
  storageName: string | null
  vendorId: number | null
  storageOwner: string | null
  province: string | null
  district: string | null
  subDistrict: string | null
  regionName: string | null
  latitude: number
  longitude: number
}

type PoliceStation = {
  uuid: string | number | null
  name: string
  province: string | null
  district: string | null
  subDistrict: string | null
  latitude: number
  longitude: number
}

type FireStation = {
  uuid: string
  longdoId: string | null
  name: string | null
  address: string | null
  tel: string | null
  icon: string | null
  tag: string | null
  url: string | null
  contributor: string | null
  verified: string | boolean | null
  obsoleted: string | boolean | null
  latitude: number
  longitude: number
}

type Hospital = {
  uuid: string
  longdoId: string | null
  name: string | null
  address: string | null
  tel: string | null
  icon: string | null
  tag: string | null
  url: string | null
  contributor: string | null
  verified: string | boolean | null
  obsoleted: string | boolean | null
  latitude: number
  longitude: number
}

type FuelStatusStation = {
  uuid: string
  stationId: string | null
  govCode: string | null
  name: string | null
  brand: string | null
  sourceType: string | null
  address: string | null
  tambon: string | null
  amphoe: string | null
  province: string | null
  fuels: Record<string, string | null>
  reporterId: string | null
  lastReport: string | null
  latitude: number
  longitude: number
}

type SupplierLocation = {
  uuid: string
  no: number | null
  address: string | null

  supplierName?: string | null
  supplier_name?: string | null

  dailyProductionCapacityLiters?: number | null
  daily_production_capacity_liters?: number | null

  productionCapacityLpd?: number | null
  production_capacity_lpd?: number | null

  latitude?: number | string | null
  longitude?: number | string | null
  lat?: number | string | null
  lon?: number | string | null
}

type B100Supplier = SupplierLocation
type EthanolSupplier = SupplierLocation

const mapEl = ref<HTMLDivElement | null>(null)
const colorMode = useColorMode()

const isLoading = ref(false)
const errorMessage = ref('')

let mapInstance: any = null
let leafletInstance: any = null
let resizeObserver: ResizeObserver | null = null
let resizeTimer: number | null = null

let storageClusterLayer: any = null
let policeClusterLayer: any = null
let fireClusterLayer: any = null
let hospitalClusterLayer: any = null
let fuelStationClusterLayer: any = null
let b100ClusterLayer: any = null
let ethanolClusterLayer: any = null

let policeLoaded = false
let fireLoaded = false
let hospitalLoaded = false
let fuelStationLoaded = false
let b100Loaded = false
let ethanolLoaded = false

function getLatLng(item: any): [number, number] | null {
  const latitude = Number(item.latitude ?? item.lat)
  const longitude = Number(item.longitude ?? item.lon)

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude))
    return null

  return [latitude, longitude]
}

function getSupplierName(item: SupplierLocation, fallback: string) {
  return item.supplierName || item.supplier_name || fallback
}

function getDailyCapacity(item: SupplierLocation) {
  const value = item.dailyProductionCapacityLiters ?? item.daily_production_capacity_liters

  if (!value)
    return '-'

  return Number(value).toLocaleString()
}

function getCapacityLpd(item: SupplierLocation) {
  const value = item.productionCapacityLpd ?? item.production_capacity_lpd

  if (!value)
    return '-'

  return Number(value).toLocaleString()
}

function storageMarkerHtml() {
  return `
    <div class="marker-dot marker-storage">
      <div class="marker-dot-inner"></div>
    </div>
  `
}

function policeMarkerHtml() {
  return `
    <div class="marker-dot marker-police">
      <div class="marker-dot-inner"></div>
    </div>
  `
}

function fireMarkerHtml() {
  return `
    <div class="marker-dot marker-fire">
      <div class="marker-dot-inner"></div>
    </div>
  `
}

function hospitalMarkerHtml() {
  return `
    <div class="marker-dot marker-hospital">
      <div class="marker-dot-inner"></div>
    </div>
  `
}

function fuelStationMarkerHtml() {
  return `
    <div class="marker-dot marker-fuel-station">
      <div class="marker-dot-inner"></div>
    </div>
  `
}

function b100MarkerHtml() {
  return `
    <div class="marker-dot marker-b100">
      <div class="marker-dot-inner"></div>
    </div>
  `
}

function ethanolMarkerHtml() {
  return `
    <div class="marker-dot marker-ethanol">
      <div class="marker-dot-inner"></div>
    </div>
  `
}

function refreshMapSize(delay = 120) {
  if (resizeTimer)
    window.clearTimeout(resizeTimer)

  resizeTimer = window.setTimeout(() => {
    mapInstance?.invalidateSize({
      animate: false,
      pan: false,
    })
  }, delay)
}

function handleWindowResize() {
  refreshMapSize(180)
}

function storagePopupHtml(item: StorageLocation) {
  return `
    <div style="min-width: 260px">
      <strong>${item.storageName || '-'}</strong>
      <br />
      <span>ประเภท: คลัง / สถานที่จัดเก็บ</span>
      <br />
      <span>Depot ID: ${item.depotId ?? '-'}</span>
      <br />
      <span>Vendor ID: ${item.vendorId ?? '-'}</span>
      <br />
      <span>เจ้าของ: ${item.storageOwner || '-'}</span>
      <br />
      <span>จังหวัด: ${item.province || '-'}</span>
      <br />
      <span>อำเภอ: ${item.district || '-'}</span>
      <br />
      <span>ตำบล: ${item.subDistrict || '-'}</span>
      <br />
      <span>ภูมิภาค: ${item.regionName || '-'}</span>
      <br />
      <span>Lat: ${item.latitude}</span>
      <br />
      <span>Lng: ${item.longitude}</span>
    </div>
  `
}

function policePopupHtml(item: PoliceStation) {
  return `
    <div style="min-width: 240px">
      <strong>${item.name || '-'}</strong>
      <br />
      <span>ประเภท: สถานีตำรวจ</span>
      <br />
      <span>จังหวัด: ${item.province || '-'}</span>
      <br />
      <span>อำเภอ: ${item.district || '-'}</span>
      <br />
      <span>ตำบล: ${item.subDistrict || '-'}</span>
      <br />
      <span>Lat: ${item.latitude}</span>
      <br />
      <span>Lng: ${item.longitude}</span>
    </div>
  `
}

function firePopupHtml(item: FireStation) {
  return `
    <div style="min-width: 260px">
      <strong>${item.name || '-'}</strong>
      <br />
      <span>ประเภท: สถานีดับเพลิง</span>
      <br />
      <span>Longdo ID: ${item.longdoId || '-'}</span>
      <br />
      <span>ที่อยู่: ${item.address || '-'}</span>
      <br />
      <span>โทร: ${item.tel || '-'}</span>
      <br />
      <span>Verified: ${item.verified ?? '-'}</span>
      <br />
      <span>Lat: ${item.latitude}</span>
      <br />
      <span>Lng: ${item.longitude}</span>
    </div>
  `
}

function hospitalPopupHtml(item: Hospital) {
  const urlHtml = item.url
    ? `<br /><span>URL: <a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.url}</a></span>`
    : ''

  return `
    <div style="min-width: 270px">
      <strong>${item.name || '-'}</strong>
      <br />
      <span>ประเภท: โรงพยาบาล / สถานพยาบาล</span>
      <br />
      <span>Longdo ID: ${item.longdoId || '-'}</span>
      <br />
      <span>ที่อยู่: ${item.address || '-'}</span>
      <br />
      <span>โทร: ${item.tel || '-'}</span>
      <br />
      <span>Verified: ${item.verified ?? '-'}</span>
      ${urlHtml}
      <br />
      <span>Lat: ${item.latitude}</span>
      <br />
      <span>Lng: ${item.longitude}</span>
    </div>
  `
}

function fuelStationPopupHtml(item: FuelStatusStation) {
  const fuelList = Object.entries(item.fuels || {})
    .map(([key, value]) => `<span>${key}: ${value || '-'}</span>`)
    .join('<br />')

  return `
    <div style="min-width: 280px">
      <strong>${item.name || '-'}</strong>
      <br />
      <span>ประเภท: สถานีบริการน้ำมัน</span>
      <br />
      <span>Brand: ${item.brand || '-'}</span>
      <br />
      <span>Gov Code: ${item.govCode || '-'}</span>
      <br />
      <span>Station ID: ${item.stationId || '-'}</span>
      <br />
      <span>ที่อยู่: ${item.address || '-'}</span>
      <br />
      <span>ตำบล: ${item.tambon || '-'}</span>
      <br />
      <span>อำเภอ: ${item.amphoe || '-'}</span>
      <br />
      <span>จังหวัด: ${item.province || '-'}</span>
      <hr style="margin: 6px 0" />
      ${fuelList}
      <hr style="margin: 6px 0" />
      <span>Last Report: ${item.lastReport || '-'}</span>
      <br />
      <span>Lat: ${item.latitude}</span>
      <br />
      <span>Lng: ${item.longitude}</span>
    </div>
  `
}

function b100PopupHtml(item: B100Supplier, latitude: number, longitude: number) {
  return `
    <div style="min-width: 270px">
      <strong>${getSupplierName(item, 'ผู้ผลิต B100')}</strong>
      <br />
      <span>ประเภท: ผู้ผลิต B100</span>
      <br />
      <span>ลำดับ: ${item.no ?? '-'}</span>
      <br />
      <span>กำลังผลิตต่อวัน: ${getDailyCapacity(item)} ลิตร/วัน</span>
      <br />
      <span>Production Capacity LPD: ${getCapacityLpd(item)}</span>
      <br />
      <span>ที่อยู่: ${item.address || '-'}</span>
      <br />
      <span>Lat: ${latitude}</span>
      <br />
      <span>Lng: ${longitude}</span>
    </div>
  `
}

function ethanolPopupHtml(item: EthanolSupplier, latitude: number, longitude: number) {
  return `
    <div style="min-width: 270px">
      <strong>${getSupplierName(item, 'ผู้ผลิตเอทานอล')}</strong>
      <br />
      <span>ประเภท: ผู้ผลิตเอทานอล</span>
      <br />
      <span>ลำดับ: ${item.no ?? '-'}</span>
      <br />
      <span>กำลังผลิตต่อวัน: ${getDailyCapacity(item)} ลิตร/วัน</span>
      <br />
      <span>Production Capacity LPD: ${getCapacityLpd(item)}</span>
      <br />
      <span>ที่อยู่: ${item.address || '-'}</span>
      <br />
      <span>Lat: ${latitude}</span>
      <br />
      <span>Lng: ${longitude}</span>
    </div>
  `
}

function createClusterLayer(
  L: any,
  type: 'storage' | 'police' | 'fire' | 'hospital' | 'fuel-station' | 'b100' | 'ethanol',
) {
  if (typeof (L as any).markerClusterGroup !== 'function') {
    console.warn('leaflet.markercluster is not loaded. Fallback to normal layerGroup.')
    return L.layerGroup()
  }

  return (L as any).markerClusterGroup({
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    disableClusteringAtZoom: 15,
    maxClusterRadius: 55,
    chunkedLoading: true,
    chunkInterval: 120,
    chunkDelay: 40,

    iconCreateFunction(cluster: any) {
      const count = cluster.getChildCount()

      return L.divIcon({
        html: `
          <div class="cluster-badge cluster-${type}">
            <span>${count}</span>
          </div>
        `,
        className: 'cluster-wrapper',
        iconSize: L.point(42, 42),
      })
    },
  })
}

async function loadStorageLocations(L: any) {
  if (!mapInstance || !storageClusterLayer)
    return []

  const locations = await $fetch<StorageLocation[]>('/api/directus/storage-locations')

  storageClusterLayer.clearLayers()

  const bounds: [number, number][] = []

  locations.forEach((item) => {
    const marker = L.marker([item.latitude, item.longitude], {
      icon: L.divIcon({
        className: 'custom-map-marker',
        html: storageMarkerHtml(),
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    })

    marker.bindPopup(storagePopupHtml(item))
    storageClusterLayer.addLayer(marker)

    bounds.push([item.latitude, item.longitude])
  })

  return bounds
}

async function loadPoliceStations(L: any) {
  if (!mapInstance || !policeClusterLayer)
    return []

  const policeStations = await $fetch<PoliceStation[]>('/api/directus/police-stations')

  policeClusterLayer.clearLayers()

  const bounds: [number, number][] = []

  policeStations.forEach((item) => {
    const marker = L.marker([item.latitude, item.longitude], {
      icon: L.divIcon({
        className: 'custom-map-marker',
        html: policeMarkerHtml(),
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      }),
    })

    marker.bindPopup(policePopupHtml(item))
    policeClusterLayer.addLayer(marker)

    bounds.push([item.latitude, item.longitude])
  })

  return bounds
}

async function loadFireStations(L: any) {
  if (!mapInstance || !fireClusterLayer)
    return []

  const fireStations = await $fetch<FireStation[]>('/api/directus/fire-stations')

  fireClusterLayer.clearLayers()

  const bounds: [number, number][] = []

  fireStations.forEach((item) => {
    const marker = L.marker([item.latitude, item.longitude], {
      icon: L.divIcon({
        className: 'custom-map-marker',
        html: fireMarkerHtml(),
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    })

    marker.bindPopup(firePopupHtml(item))
    fireClusterLayer.addLayer(marker)

    bounds.push([item.latitude, item.longitude])
  })

  return bounds
}

async function loadHospitals(L: any) {
  if (!mapInstance || !hospitalClusterLayer)
    return []

  const hospitals = await $fetch<Hospital[]>('/api/directus/hospitals')

  hospitalClusterLayer.clearLayers()

  const bounds: [number, number][] = []

  hospitals.forEach((item) => {
    const marker = L.marker([item.latitude, item.longitude], {
      icon: L.divIcon({
        className: 'custom-map-marker',
        html: hospitalMarkerHtml(),
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    })

    marker.bindPopup(hospitalPopupHtml(item))
    hospitalClusterLayer.addLayer(marker)

    bounds.push([item.latitude, item.longitude])
  })

  return bounds
}

async function loadFuelStatusStations(L: any) {
  if (!mapInstance || !fuelStationClusterLayer)
    return []

  const stations = await $fetch<FuelStatusStation[]>('/api/directus/fuelstatus-stations')

  fuelStationClusterLayer.clearLayers()

  const bounds: [number, number][] = []

  stations.forEach((item) => {
    const marker = L.marker([item.latitude, item.longitude], {
      icon: L.divIcon({
        className: 'custom-map-marker',
        html: fuelStationMarkerHtml(),
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    })

    marker.bindPopup(fuelStationPopupHtml(item))
    fuelStationClusterLayer.addLayer(marker)

    bounds.push([item.latitude, item.longitude])
  })

  return bounds
}

async function loadB100Suppliers(L: any) {
  if (!mapInstance || !b100ClusterLayer)
    return []

  const suppliers = await $fetch<B100Supplier[]>('/api/directus/b100-suppliers')

  b100ClusterLayer.clearLayers()

  const bounds: [number, number][] = []

  suppliers.forEach((item) => {
    const latLng = getLatLng(item)

    if (!latLng)
      return

    const [latitude, longitude] = latLng

    const marker = L.marker([latitude, longitude], {
      icon: L.divIcon({
        className: 'custom-map-marker',
        html: b100MarkerHtml(),
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    })

    marker.bindPopup(b100PopupHtml(item, latitude, longitude))
    b100ClusterLayer.addLayer(marker)

    bounds.push([latitude, longitude])
  })

  return bounds
}

async function loadEthanolSuppliers(L: any) {
  if (!mapInstance || !ethanolClusterLayer)
    return []

  const suppliers = await $fetch<EthanolSupplier[]>('/api/directus/ethanol-suppliers')

  ethanolClusterLayer.clearLayers()

  const bounds: [number, number][] = []

  suppliers.forEach((item) => {
    const latLng = getLatLng(item)

    if (!latLng)
      return

    const [latitude, longitude] = latLng

    const marker = L.marker([latitude, longitude], {
      icon: L.divIcon({
        className: 'custom-map-marker',
        html: ethanolMarkerHtml(),
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    })

    marker.bindPopup(ethanolPopupHtml(item, latitude, longitude))
    ethanolClusterLayer.addLayer(marker)

    bounds.push([latitude, longitude])
  })

  return bounds
}

async function loadInitialMapData(L: any) {
  if (!mapInstance)
    return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const storageBounds = await loadStorageLocations(L)

    if (storageBounds.length) {
      mapInstance.fitBounds(storageBounds, {
        padding: [40, 40],
        maxZoom: 11,
      })
    }

    refreshMapSize(300)
  }
  catch (error) {
    console.error(error)
    errorMessage.value = 'ไม่สามารถดึงข้อมูลคลัง / สถานที่จัดเก็บจาก Directus ได้'
  }
  finally {
    isLoading.value = false
  }
}

async function loadPoliceLayerOnDemand() {
  if (!mapInstance || !leafletInstance)
    return

  if (policeLoaded)
    return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const bounds = await loadPoliceStations(leafletInstance)
    policeLoaded = true

    if (!mapInstance.hasLayer(policeClusterLayer))
      policeClusterLayer.addTo(mapInstance)

    if (bounds.length) {
      mapInstance.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 11,
      })
    }

    refreshMapSize(300)
  }
  catch (error) {
    console.error(error)
    policeLoaded = false
    errorMessage.value = 'ไม่สามารถโหลดข้อมูลสถานีตำรวจได้'
  }
  finally {
    isLoading.value = false
  }
}

async function loadFireLayerOnDemand() {
  if (!mapInstance || !leafletInstance)
    return

  if (fireLoaded)
    return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const bounds = await loadFireStations(leafletInstance)
    fireLoaded = true

    if (!mapInstance.hasLayer(fireClusterLayer))
      fireClusterLayer.addTo(mapInstance)

    if (bounds.length) {
      mapInstance.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 11,
      })
    }

    refreshMapSize(300)
  }
  catch (error) {
    console.error(error)
    fireLoaded = false
    errorMessage.value = 'ไม่สามารถโหลดข้อมูลสถานีดับเพลิงได้'
  }
  finally {
    isLoading.value = false
  }
}

async function loadHospitalLayerOnDemand() {
  if (!mapInstance || !leafletInstance)
    return

  if (hospitalLoaded)
    return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const bounds = await loadHospitals(leafletInstance)
    hospitalLoaded = true

    if (!mapInstance.hasLayer(hospitalClusterLayer))
      hospitalClusterLayer.addTo(mapInstance)

    if (bounds.length) {
      mapInstance.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 11,
      })
    }

    refreshMapSize(300)
  }
  catch (error) {
    console.error(error)
    hospitalLoaded = false
    errorMessage.value = 'ไม่สามารถโหลดข้อมูลโรงพยาบาลได้'
  }
  finally {
    isLoading.value = false
  }
}

async function loadFuelStationLayerOnDemand() {
  if (!mapInstance || !leafletInstance)
    return

  if (fuelStationLoaded)
    return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const bounds = await loadFuelStatusStations(leafletInstance)
    fuelStationLoaded = true

    if (!mapInstance.hasLayer(fuelStationClusterLayer))
      fuelStationClusterLayer.addTo(mapInstance)

    if (bounds.length) {
      mapInstance.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 11,
      })
    }

    refreshMapSize(300)
  }
  catch (error) {
    console.error(error)
    fuelStationLoaded = false
    errorMessage.value = 'ไม่สามารถโหลดข้อมูลสถานีบริการน้ำมันได้'
  }
  finally {
    isLoading.value = false
  }
}

async function loadB100LayerOnDemand() {
  if (!mapInstance || !leafletInstance)
    return

  if (b100Loaded)
    return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const bounds = await loadB100Suppliers(leafletInstance)
    b100Loaded = true

    if (!mapInstance.hasLayer(b100ClusterLayer))
      b100ClusterLayer.addTo(mapInstance)

    if (bounds.length) {
      mapInstance.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 11,
      })
    }

    refreshMapSize(300)
  }
  catch (error) {
    console.error(error)
    b100Loaded = false
    errorMessage.value = 'ไม่สามารถโหลดข้อมูลผู้ผลิต B100 ได้'
  }
  finally {
    isLoading.value = false
  }
}

async function loadEthanolLayerOnDemand() {
  if (!mapInstance || !leafletInstance)
    return

  if (ethanolLoaded)
    return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const bounds = await loadEthanolSuppliers(leafletInstance)
    ethanolLoaded = true

    if (!mapInstance.hasLayer(ethanolClusterLayer))
      ethanolClusterLayer.addTo(mapInstance)

    if (bounds.length) {
      mapInstance.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 11,
      })
    }

    refreshMapSize(300)
  }
  catch (error) {
    console.error(error)
    ethanolLoaded = false
    errorMessage.value = 'ไม่สามารถโหลดข้อมูลผู้ผลิตเอทานอลได้'
  }
  finally {
    isLoading.value = false
  }
}


function createLegendControl(L: any) {
  const LegendControl = L.Control.extend({
    options: {
      position: 'bottomright',
    },

    onAdd() {
      const container = L.DomUtil.create(
        'div',
        'leaflet-control map-legend',
      )

      container.innerHTML = `
        <div class="map-legend-title">
          คำอธิบายสัญลักษณ์
        </div>

        <div class="map-legend-list">
          <div class="map-legend-item">
            <span class="map-legend-dot marker-storage"></span>
            <span>คลัง / สถานที่จัดเก็บ</span>
          </div>

          <div class="map-legend-item">
            <span class="map-legend-dot marker-fuel-station"></span>
            <span>สถานีบริการน้ำมัน</span>
          </div>

          <div class="map-legend-item">
            <span class="map-legend-dot marker-b100"></span>
            <span>ผู้ผลิต B100</span>
          </div>

          <div class="map-legend-item">
            <span class="map-legend-dot marker-ethanol"></span>
            <span>ผู้ผลิตเอทานอล</span>
          </div>

          <div class="map-legend-item">
            <span class="map-legend-dot marker-police"></span>
            <span>สถานีตำรวจ</span>
          </div>

          <div class="map-legend-item">
            <span class="map-legend-dot marker-fire"></span>
            <span>สถานีดับเพลิง</span>
          </div>

          <div class="map-legend-item">
            <span class="map-legend-dot marker-hospital"></span>
            <span>โรงพยาบาล</span>
          </div>
        </div>
      `

      L.DomEvent.disableClickPropagation(container)
      L.DomEvent.disableScrollPropagation(container)

      return container
    },
  })

  return new LegendControl()
}

onMounted(async () => {
  if (!mapEl.value)
    return

  const leafletModule = await import('leaflet')
  const L = (leafletModule as any).default || leafletModule

  ;(window as any).L = L

  try {
    await import('leaflet.markercluster')
  }
  catch (error) {
    console.error('Cannot load leaflet.markercluster:', error)
  }

  leafletInstance = L

  mapInstance = L.map(mapEl.value, {
    zoomControl: false,
    attributionControl: true,
  }).setView([13.7563, 100.5018], 6)

  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  })

  const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; OpenTopoMap contributors',
  })

  osm.addTo(mapInstance)

  L.control.zoom({
    position: 'topright',
  }).addTo(mapInstance)

  const FullscreenControl = L.Control.extend({
    options: {
      position: 'topright',
    },

    onAdd() {
      const container = L.DomUtil.create(
        'div',
        'leaflet-bar leaflet-control leaflet-control-fullscreen-wrapper',
      )

      const button = L.DomUtil.create(
        'button',
        'leaflet-control-fullscreen',
        container,
      )

      button.type = 'button'
      button.title = 'Fullscreen'
      button.innerHTML = '⛶'

      L.DomEvent.disableClickPropagation(container)
      L.DomEvent.disableScrollPropagation(container)

      L.DomEvent.on(button, 'click', () => {
        const mapContainer = mapEl.value

        if (!mapContainer)
          return

        if (!document.fullscreenElement) {
          mapContainer.requestFullscreen()
          refreshMapSize(400)
          return
        }

        document.exitFullscreen()
        refreshMapSize(400)
      })

      return container
    },
  })

  mapInstance.addControl(new FullscreenControl())

  const legendControl = createLegendControl(L)
  legendControl.addTo(mapInstance)

  storageClusterLayer = createClusterLayer(L, 'storage')
  policeClusterLayer = createClusterLayer(L, 'police')
  fireClusterLayer = createClusterLayer(L, 'fire')
  hospitalClusterLayer = createClusterLayer(L, 'hospital')
  fuelStationClusterLayer = createClusterLayer(L, 'fuel-station')
  b100ClusterLayer = createClusterLayer(L, 'b100')
  ethanolClusterLayer = createClusterLayer(L, 'ethanol')

  storageClusterLayer.addTo(mapInstance)

  L.control.layers(
    {
      OpenStreetMap: osm,
      Topographic: topo,
    },
    {
      'คลัง / สถานที่จัดเก็บ': storageClusterLayer,
      'สถานีบริการน้ำมัน': fuelStationClusterLayer,
      'ผู้ผลิต B100': b100ClusterLayer,
      'ผู้ผลิตเอทานอล': ethanolClusterLayer,
      'สถานีตำรวจ': policeClusterLayer,
      'สถานีดับเพลิง': fireClusterLayer,
      'โรงพยาบาล': hospitalClusterLayer,
    },
    {
      position: 'topright',
      collapsed: true,
    },
  ).addTo(mapInstance)

  mapInstance.on('overlayadd', async (event: any) => {
    if (event.name === 'สถานีตำรวจ') {
      await loadPoliceLayerOnDemand()
      return
    }

    if (event.name === 'สถานีดับเพลิง') {
      await loadFireLayerOnDemand()
      return
    }

    if (event.name === 'โรงพยาบาล') {
      await loadHospitalLayerOnDemand()
      return
    }

    if (event.name === 'สถานีบริการน้ำมัน') {
      await loadFuelStationLayerOnDemand()
      return
    }

    if (event.name === 'ผู้ผลิต B100') {
      await loadB100LayerOnDemand()
      return
    }

    if (event.name === 'ผู้ผลิตเอทานอล') {
      await loadEthanolLayerOnDemand()
    }
  })

  resizeObserver = new ResizeObserver(() => {
    refreshMapSize(150)
  })

  resizeObserver.observe(mapEl.value)

  window.addEventListener('resize', handleWindowResize)

  await loadInitialMapData(L)

  refreshMapSize(300)
  refreshMapSize(600)
})

watch(
  () => colorMode.value,
  () => {
    refreshMapSize(150)
  },
)

onBeforeUnmount(() => {
  if (resizeTimer)
    window.clearTimeout(resizeTimer)

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  window.removeEventListener('resize', handleWindowResize)

  if (mapInstance) {
    mapInstance.off()
    mapInstance.remove()
  }

  mapInstance = null
  leafletInstance = null

  storageClusterLayer = null
  policeClusterLayer = null
  fireClusterLayer = null
  hospitalClusterLayer = null
  fuelStationClusterLayer = null
  b100ClusterLayer = null
  ethanolClusterLayer = null

  policeLoaded = false
  fireLoaded = false
  hospitalLoaded = false
  fuelStationLoaded = false
  b100Loaded = false
  ethanolLoaded = false
})
</script>

<template>
  <div
    class="map-page"
    :class="{ 'is-dark': colorMode.value === 'dark' }"
  >
    <div class="map-header">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          Map
        </h2>

        <p
          v-if="isLoading"
          class="text-sm text-muted-foreground"
        >
          กำลังโหลดข้อมูลจาก Directus...
        </p>

        <p
          v-else-if="errorMessage"
          class="text-sm text-destructive"
        >
          {{ errorMessage }}
        </p>
      </div>
    </div>

    <div class="map-shell">
      <div ref="mapEl" class="map-container" />
    </div>
  </div>
</template>

<style scoped>
.map-page {
  position: relative;
  isolation: isolate;
  z-index: 0;

  width: 100%;
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  background: var(--background);
}

.map-header {
  display: flex;
  min-height: 40px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.map-shell {
  position: relative;
  isolation: isolate;
  z-index: 0;

  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-radius: 12px;
  background: var(--background);
}

.map-container {
  position: absolute;
  inset: 0;
  z-index: 0;

  width: 100%;
  height: 100%;
  background: var(--background);
}

:deep(.leaflet-container) {
  position: relative;
  z-index: 0;

  width: 100% !important;
  height: 100% !important;
  background: var(--background);
  font-family: inherit;
}

:deep(.leaflet-tile) {
  filter: none;
}

.map-page.is-dark :deep(.leaflet-tile) {
  filter: grayscale(1) invert(1) contrast(1.08) brightness(0.86);
}

:deep(.leaflet-pane) {
  z-index: 1;
}

:deep(.leaflet-tile-pane) {
  z-index: 1;
}

:deep(.leaflet-overlay-pane) {
  z-index: 2;
}

:deep(.leaflet-marker-pane) {
  z-index: 3;
}

:deep(.leaflet-tooltip-pane) {
  z-index: 4;
}

:deep(.leaflet-popup-pane) {
  z-index: 5;
}

:deep(.leaflet-control-container) {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

:deep(.leaflet-top),
:deep(.leaflet-bottom) {
  z-index: 11;
  pointer-events: none;
}

:deep(.leaflet-control) {
  pointer-events: auto;
}

:deep(.leaflet-top.leaflet-right) {
  top: 12px;
  right: 12px;
}

:deep(.leaflet-control-zoom) {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 8px 8px 0 0;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.12);
}

:deep(.leaflet-control-zoom a) {
  width: 36px;
  height: 36px;
  line-height: 34px;
  border-color: var(--border);
  color: var(--foreground);
  background: var(--background);
  font-size: 22px;
  font-weight: 700;
}

:deep(.leaflet-control-zoom a:hover) {
  color: var(--foreground);
  background: var(--muted);
}

:deep(.leaflet-control-fullscreen-wrapper) {
  margin-top: 0;
  overflow: hidden;
  border: 1px solid var(--border);
  border-top: 0;
  border-radius: 0 0 8px 8px;
  background: var(--background);
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.12);
}

:deep(.leaflet-control-fullscreen) {
  display: block;
  width: 36px;
  height: 36px;
  cursor: pointer;
  border: 0;
  background: var(--background);
  color: var(--foreground);
  font-size: 22px;
  font-weight: 700;
  line-height: 32px;
}

:deep(.leaflet-control-fullscreen:hover) {
  background: var(--muted);
}

:deep(.leaflet-control-layers) {
  margin-top: 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--background);
  color: var(--foreground);
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.12);
}

:deep(.leaflet-control-layers-toggle) {
  width: 42px;
  height: 42px;
  filter: grayscale(1);
}

:deep(.leaflet-control-layers-list) {
  background: var(--background);
  color: var(--foreground);
}

:deep(.leaflet-control-attribution) {
  border-radius: 8px 0 0 0;
  background: color-mix(in oklab, var(--background) 90%, transparent);
  color: var(--muted-foreground);
}

:deep(.leaflet-popup-content-wrapper),
:deep(.leaflet-popup-tip) {
  background: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
  box-shadow: 0 12px 30px rgb(0 0 0 / 0.18);
}

:deep(.leaflet-popup-content) {
  color: var(--foreground);
}

:global(.custom-map-marker) {
  background: transparent;
  border: 0;
}

:global(.marker-dot) {
  --marker-color: var(--primary);

  display: flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: color-mix(in oklab, var(--marker-color) 25%, transparent);
}

:global(.marker-storage) {
  --marker-color: color-mix(in oklab, var(--primary) 70%, #f97316);
}

:global(.marker-police) {
  --marker-color: color-mix(in oklab, var(--primary) 65%, #3b82f6);
}

:global(.marker-fire) {
  --marker-color: color-mix(in oklab, var(--primary) 60%, #ef4444);
}

:global(.marker-hospital) {
  --marker-color: color-mix(in oklab, var(--primary) 60%, #06b6d4);
}

:global(.marker-fuel-station) {
  --marker-color: color-mix(in oklab, var(--primary) 62%, #eab308);
}

:global(.marker-b100) {
  --marker-color: color-mix(in oklab, var(--primary) 65%, #22c55e);
}

:global(.marker-ethanol) {
  --marker-color: color-mix(in oklab, var(--primary) 60%, #a855f7);
}

:global(.marker-dot-inner) {
  width: 14px;
  height: 14px;
  border: 3px solid var(--primary-foreground);
  border-radius: 9999px;
  background: var(--marker-color);
  box-shadow: 0 6px 16px rgb(0 0 0 / 0.25);
}

:global(.cluster-wrapper) {
  background: transparent;
  border: 0;
}

:global(.cluster-badge) {
  display: flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--background);
  border-radius: 9999px;
  color: var(--primary-foreground);
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 8px 20px rgb(0 0 0 / 0.28);
}

:global(.cluster-storage) {
  background: color-mix(in oklab, var(--primary) 70%, #f97316);
}

:global(.cluster-police) {
  background: color-mix(in oklab, var(--primary) 65%, #3b82f6);
}

:global(.cluster-fire) {
  background: color-mix(in oklab, var(--primary) 60%, #ef4444);
}

:global(.cluster-hospital) {
  background: color-mix(in oklab, var(--primary) 60%, #06b6d4);
}

:global(.cluster-fuel-station) {
  background: color-mix(in oklab, var(--primary) 62%, #eab308);
}

:global(.cluster-b100) {
  background: color-mix(in oklab, var(--primary) 65%, #22c55e);
}

:global(.cluster-ethanol) {
  background: color-mix(in oklab, var(--primary) 60%, #a855f7);
}

:global(.cluster-badge span) {
  line-height: 1;
}


:global(.map-legend) {
  min-width: 210px;
  margin-right: 12px !important;
  margin-bottom: 24px !important;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: color-mix(
    in oklab,
    var(--background) 40%,
    transparent
  );
  color: var(--foreground);
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.16);
  backdrop-filter: blur(8px);
}

:global(.map-legend-title) {
  margin-bottom: 9px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
}

:global(.map-legend-list) {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

:global(.map-legend-item) {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--foreground);
  font-size: 12px;
  line-height: 1.3;
  white-space: nowrap;
}

:global(.map-legend-dot) {
  display: inline-block;
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  border: 2px solid var(--background);
  border-radius: 9999px;
  background: var(--marker-color);
  box-shadow:
    0 0 0 1px color-mix(
      in oklab,
      var(--marker-color) 70%,
      transparent
    ),
    0 3px 8px rgb(0 0 0 / 0.2);
}

@media (max-width: 768px) {
  .map-page {
    height: calc(100vh - 48px);
    gap: 12px;
  }

  .map-header {
    align-items: stretch;
    flex-direction: column;
  }

  :global(.map-legend) {
    min-width: 0;
    max-width: 190px;
    margin-right: 8px !important;
    margin-bottom: 24px !important;
    padding: 10px;
  }

  :global(.map-legend-item) {
    font-size: 11px;
    white-space: normal;
  }
}
</style>