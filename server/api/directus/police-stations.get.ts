type DirectusLoginResponse = {
  data?: {
    access_token?: string
  }
}

type DirectusItemsResponse = {
  data?: Record<string, any>[]
}

function pickValue(item: Record<string, any>, keys: string[]) {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null && item[key] !== '')
      return item[key]
  }

  return null
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

  const result = await $fetch<DirectusItemsResponse>(`${directusUrl}/items/longdo_police_station`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    query: {
      limit: 5000,
      fields: '*',
    },
  })

  return (result.data || [])
    .map((item) => {
      const latitude = Number(pickValue(item, [
        'latitude',
        'lat',
        'LAT',
        'Latitude',
      ]))

      const longitude = Number(pickValue(item, [
        'longitude',
        'lng',
        'lon',
        'LONG',
        'Longitude',
      ]))

      return {
        uuid: pickValue(item, ['uuid', 'id']),
        name: pickValue(item, [
          'name',
          'station_name',
          'police_station_name',
          'title',
          'display_name',
        ]) || 'Police Station',
        province: pickValue(item, ['province', 'province_name']),
        district: pickValue(item, ['district', 'district_name', 'amphoe']),
        subDistrict: pickValue(item, ['sub_district', 'subdistrict', 'tambon']),
        latitude,
        longitude,
      }
    })
    .filter(item => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
}, {
  maxAge: 60 * 10,
  name: 'directus-police-stations',
})