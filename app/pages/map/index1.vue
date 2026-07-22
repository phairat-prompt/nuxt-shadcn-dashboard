<script setup lang="ts">
import 'leaflet/dist/leaflet.css'

definePageMeta({
  title: 'Map',
})

const mapEl = ref<HTMLDivElement | null>(null)
const colorMode = useColorMode()

let mapInstance: any = null
let resizeObserver: ResizeObserver | null = null
let resizeTimer: number | null = null

const locations = [
  {
    name: 'กรมธุรกิจพลังงาน',
    lat: 13.7799,
    lng: 100.5601,
    type: 'DOEB',
  },
  {
    name: 'คลังน้ำมันตัวอย่าง',
    lat: 13.7215,
    lng: 100.5152,
    type: 'Depot',
  },
  {
    name: 'สถานีบริการตัวอย่าง',
    lat: 13.7563,
    lng: 100.5018,
    type: 'Station',
  },
]

function markerHtml(type: string) {
  return `
    <div class="marker-dot marker-${type.toLowerCase()}">
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

onMounted(async () => {
  if (!mapEl.value)
    return

  const L = await import('leaflet')

  mapInstance = L.map(mapEl.value, {
    zoomControl: false,
    attributionControl: true,
  }).setView([13.7563, 100.5018], 11)

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

  const locationLayer = L.layerGroup()

  locations.forEach((item) => {
    const marker = L.marker([item.lat, item.lng], {
      icon: L.divIcon({
        className: 'custom-map-marker',
        html: markerHtml(item.type),
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    })

    marker
      .addTo(locationLayer)
      .bindPopup(`
        <div style="min-width: 180px">
          <strong>${item.name}</strong>
          <br />
          <span>ประเภท: ${item.type}</span>
          <br />
          <span>Lat: ${item.lat}</span>
          <br />
          <span>Lng: ${item.lng}</span>
        </div>
      `)
  })

  locationLayer.addTo(mapInstance)

  L.control.layers(
    {
      OpenStreetMap: osm,
      Topographic: topo,
    },
    {
      Locations: locationLayer,
    },
    {
      position: 'topright',
      collapsed: true,
    },
  ).addTo(mapInstance)

  resizeObserver = new ResizeObserver(() => {
    refreshMapSize(150)
  })

  resizeObserver.observe(mapEl.value)

  window.addEventListener('resize', handleWindowResize)

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
    mapInstance.remove()
    mapInstance = null
  }
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
      </div>

      <!-- <div class="flex items-center space-x-2">
        <BaseDateRangePicker />
      </div> -->
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

/* Light theme: map ปกติ */
:deep(.leaflet-tile) {
  filter: none;
}

/* Dark theme: map ขาวดำโทนมืด */
.map-page.is-dark :deep(.leaflet-tile) {
  filter: grayscale(1) invert(1) contrast(1.08) brightness(0.86);
}

/* Leaflet z-index: อยู่ใต้ Template Customizer */
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

/* Zoom */
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

/* Fullscreen */
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

/* Layers */
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

/* Popup */
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

/* Marker */
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

:global(.marker-depot) {
  --marker-color: color-mix(in oklab, var(--primary) 70%, #f97316);
}

:global(.marker-station) {
  --marker-color: color-mix(in oklab, var(--primary) 70%, #22c55e);
}

:global(.marker-doeb) {
  --marker-color: var(--primary);
}

:global(.marker-dot-inner) {
  width: 14px;
  height: 14px;
  border: 3px solid var(--primary-foreground);
  border-radius: 9999px;
  background: var(--marker-color);
  box-shadow: 0 6px 16px rgb(0 0 0 / 0.25);
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
}
</style>