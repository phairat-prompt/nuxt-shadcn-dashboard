type DirectusItem = Record<string, unknown>

type DirectusListResponse = {
  data?: DirectusItem[]
}

type DirectusLoginResponse = {
  data?: {
    access_token?: string
  }
}

function normalizeDirectusUrl(value: string) {
  return value.replace(/\/+$/, '')
}

function firstValue<T = unknown>(item: DirectusItem, keys: string[]): T | null {
  for (const key of keys) {
    const value = item[key]

    if (value !== undefined && value !== null && value !== '')
      return value as T
  }

  return null
}

async function getAccessToken(
  directusUrl: string,
  email?: string,
  password?: string,
  configuredToken?: string,
) {
  if (configuredToken)
    return configuredToken

  if (!email || !password)
    return null

  const response = await $fetch<DirectusLoginResponse>(`${directusUrl}/auth/login`, {
    method: 'POST',
    body: {
      email,
      password,
    },
  })

  return response.data?.access_token || null
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig() as {
    directusUrl?: string
    directusEmail?: string
    directusPassword?: string
    directusToken?: string
  }
  const directusUrl = normalizeDirectusUrl(String(config.directusUrl || ''))

  if (!directusUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DIRECTUS_URL is not configured',
    })
  }

  try {
    const token = await getAccessToken(
      directusUrl,
      config.directusEmail ? String(config.directusEmail) : undefined,
      config.directusPassword ? String(config.directusPassword) : undefined,
      config.directusToken ? String(config.directusToken) : undefined,
    )

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : undefined

    const limit = 500
    let offset = 0
    const rows: DirectusItem[] = []

    while (true) {
      const response = await $fetch<DirectusListResponse>(
        `${directusUrl}/items/longdo_port`,
        {
          headers,
          query: {
            limit,
            offset,
            sort: 'name',
          },
        },
      )

      const page = Array.isArray(response.data) ? response.data : []
      rows.push(...page)

      if (page.length < limit)
        break

      offset += limit
    }

    return rows
      .map((item) => ({
        uuid: firstValue(item, ['uuid', 'id']),
        longdoId: firstValue<string>(item, ['longdoId', 'longdo_id', 'longdoid']),
        name: firstValue<string>(item, ['name', 'port_name', 'title']),
        address: firstValue<string>(item, ['address', 'formatted_address']),
        tel: firstValue<string>(item, ['tel', 'telephone', 'phone']),
        icon: firstValue<string>(item, ['icon']),
        tag: firstValue<string>(item, ['tag', 'tags']),
        url: firstValue<string>(item, ['url', 'website']),
        contributor: firstValue<string>(item, ['contributor']),
        verified: firstValue(item, ['verified']),
        obsoleted: firstValue(item, ['obsoleted']),
        province: firstValue<string>(item, ['province', 'province_name']),
        district: firstValue<string>(item, ['district', 'amphoe', 'district_name']),
        subDistrict: firstValue<string>(item, ['subDistrict', 'sub_district', 'tambon', 'subdistrict']),
        latitude: firstValue<number | string>(item, ['latitude', 'lat']),
        longitude: firstValue<number | string>(item, ['longitude', 'lon', 'lng']),
      }))
      .filter((item) => {
        const latitude = Number(item.latitude)
        const longitude = Number(item.longitude)

        return Number.isFinite(latitude) && Number.isFinite(longitude)
      })
  }
  catch (error: any) {
    console.error('Failed to load longdo_port from Directus:', error)

    throw createError({
      statusCode: error?.statusCode || error?.response?.status || 500,
      statusMessage: 'Cannot load longdo_port from Directus',
    })
  }
})