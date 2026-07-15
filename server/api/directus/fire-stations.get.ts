type DirectusLoginResponse = {
  data?: {
    access_token?: string
  }
}

type DirectusFireStationItem = {
  uuid: string
  id: string | null
  name: string | null
  lat: string | null
  lon: string | null
  icon: string | null
  tag: string | null
  url: string | null
  address: string | null
  tel: string | null
  contributor: string | null
  verified: string | boolean | null
  obsoleted: string | boolean | null
}

type DirectusItemsResponse = {
  data?: DirectusFireStationItem[]
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

  const result = await $fetch<DirectusItemsResponse>(`${directusUrl}/items/longdo_fire_station`, {
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
        longdoId: item.id,
        name: item.name,
        address: item.address,
        tel: item.tel,
        icon: item.icon,
        tag: item.tag,
        url: item.url,
        contributor: item.contributor,
        verified: item.verified,
        obsoleted: item.obsoleted,
        latitude,
        longitude,
      }
    })
    .filter((item) => {
      const isValidLatLng = Number.isFinite(item.latitude) && Number.isFinite(item.longitude)
      const isObsoleted = item.obsoleted === true || item.obsoleted === 'true'

      return isValidLatLng && !isObsoleted
    })
}, {
  maxAge: 60 * 10,
  name: 'directus-fire-stations',
})