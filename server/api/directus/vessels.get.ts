export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  if (!config.datalasticApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Datalastic API key is not configured',
    })
  }

  const vesselMmsiList = [
    '533368000',
    '645799000',
    '636023362',
    '311070500',
    '567527000',
    '567006921',
    '636017940',
    '525121038',
  ]

  const query = new URLSearchParams()

  query.append('api-key', config.datalasticApiKey)

  vesselMmsiList.forEach((mmsi) => {
    query.append('mmsi', mmsi)
  })

  return await $fetch(
    `https://api.datalastic.com/api/v0/vessel_bulk?${query.toString()}`,
  )
})