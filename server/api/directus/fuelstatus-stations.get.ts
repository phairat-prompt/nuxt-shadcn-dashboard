type DirectusLoginResponse = {
  data?: {
    access_token?: string
  }
}

type DirectusFuelStationItem = {
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
  lat: string | null
  lon: string | null
  D: string | null
  DP: string | null
  B20: string | null
  B: string | null
  G95: string | null
  G95P: string | null
  G97: string | null
  G98: string | null
  G91: string | null
  E20: string | null
  E85: string | null
  LPG: string | null
  NGV: string | null
  EV: string | null
  reporterId: string | null
  lastReport: string | null
}

type DirectusItemsResponse = {
  data?: DirectusFuelStationItem[]
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

  const allItems: DirectusFuelStationItem[] = []
  const limit = 1000
  let page = 1

  while (page <= 50) {
    const result = await $fetch<DirectusItemsResponse>(`${directusUrl}/items/fuelstatus_station`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      query: {
        limit,
        page,
        fields: [
          'uuid',
          'stationId',
          'govCode',
          'name',
          'brand',
          'sourceType',
          'address',
          'tambon',
          'amphoe',
          'province',
          'lat',
          'lon',
          'D',
          'DP',
          'B20',
          'B',
          'G95',
          'G95P',
          'G97',
          'G98',
          'G91',
          'E20',
          'E85',
          'LPG',
          'NGV',
          'EV',
          'reporterId',
          'lastReport',
        ].join(','),
      },
    })

    const items = result.data || []

    allItems.push(...items)

    if (items.length < limit)
      break

    page++
  }

  return allItems
    .map((item) => {
      const latitude = Number(item.lat)
      const longitude = Number(item.lon)

      return {
        uuid: item.uuid,
        stationId: item.stationId,
        govCode: item.govCode,
        name: item.name,
        brand: item.brand,
        sourceType: item.sourceType,
        address: item.address,
        tambon: item.tambon,
        amphoe: item.amphoe,
        province: item.province,
        fuels: {
          D: item.D,
          DP: item.DP,
          B20: item.B20,
          B: item.B,
          G95: item.G95,
          G95P: item.G95P,
          G97: item.G97,
          G98: item.G98,
          G91: item.G91,
          E20: item.E20,
          E85: item.E85,
          LPG: item.LPG,
          NGV: item.NGV,
          EV: item.EV,
        },
        reporterId: item.reporterId,
        lastReport: item.lastReport,
        latitude,
        longitude,
      }
    })
    .filter(item => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
}, {
  maxAge: 60 * 10,
  name: 'directus-fuelstatus-stations',
})