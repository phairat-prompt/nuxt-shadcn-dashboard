type DirectusLoginResponse = {
  data?: {
    access_token?: string
  }
}

type DirectusSupplierItem = {
  uuid: string
  no: number | null
  address: string | null
  lat: string | null
  lon: string | null
  supplier_name: string | null
  daily_production_capacity_liters: number | null
  production_capacity_lpd: number | null
}

type DirectusItemsResponse = {
  data?: DirectusSupplierItem[]
}

export default defineCachedEventHandler(async () => {
  const config = useRuntimeConfig()

  const directusUrl = config.directusUrl
  const email = config.directusEmail
  const password = config.directusPassword

  if (!directusUrl || !email || !password) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Directus runtimeConfig is missing.',
    })
  }

  const login = await $fetch<DirectusLoginResponse>(`${directusUrl}/auth/login`, {
    method: 'POST',
    body: {
      email,
      password,
    },
  })

  const token = login.data?.access_token

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Cannot login to Directus.',
    })
  }

  const result = await $fetch<DirectusItemsResponse>(`${directusUrl}/items/ethanol_suppliers`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    query: {
      limit: 10000,
    },
  })

  return (result.data || [])
    .map((item) => {
      const latitude = Number(item.lat)
      const longitude = Number(item.lon)

      return {
        uuid: item.uuid,
        no: item.no,
        address: item.address,
        supplierName: item.supplier_name,
        dailyProductionCapacityLiters: item.daily_production_capacity_liters,
        productionCapacityLpd: item.production_capacity_lpd,
        latitude,
        longitude,
      }
    })
    .filter(item => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
}, {
  maxAge: 60 * 10,
  name: 'directus-ethanol-suppliers',
})