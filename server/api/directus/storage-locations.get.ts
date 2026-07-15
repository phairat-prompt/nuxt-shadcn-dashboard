type DirectusLoginResponse = {
  data?: {
    access_token?: string
  }
}

type DirectusStorageLocation = {
  uuid: string
  depotId: number | null
  storage_name: string | null
  vendorId: number | null
  storage_owner: string | null
  province: string | null
  district: string | null
  sub_district: string | null
  regionName: string | null
  latitude: string | null
  longitude: string | null
}

type DirectusItemsResponse = {
  data?: DirectusStorageLocation[]
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const directusUrl = config.directusUrl
  const email = config.directusEmail
  const password = config.directusPassword

  if (!directusUrl || !email || !password) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Directus environment variables are missing.',
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

  const result = await $fetch<DirectusItemsResponse>(`${directusUrl}/items/apigw_storage_locations`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    query: {
      limit: -1,
      fields: [
        'uuid',
        'depotId',
        'storage_name',
        'vendorId',
        'storage_owner',
        'province',
        'district',
        'sub_district',
        'regionName',
        'latitude',
        'longitude',
      ].join(','),
      filter: JSON.stringify({
        _and: [
          {
            latitude: {
              _nnull: true,
            },
          },
          {
            longitude: {
              _nnull: true,
            },
          },
        ],
      }),
    },
  })

  return (result.data || [])
    .map((item) => {
      const lat = Number(item.latitude)
      const lng = Number(item.longitude)

      return {
        uuid: item.uuid,
        depotId: item.depotId,
        storageName: item.storage_name,
        vendorId: item.vendorId,
        storageOwner: item.storage_owner,
        province: item.province,
        district: item.district,
        subDistrict: item.sub_district,
        regionName: item.regionName,
        latitude: lat,
        longitude: lng,
      }
    })
    .filter(item => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
})