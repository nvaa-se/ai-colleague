const host = process.env.REDIS_HOST || 'localhost'
const port = +process.env.REDIS_PORT || 6379
const password = process.env.REDIS_PASSWORD || undefined
const passwordPart = password ? `:${password}@` : ''
const url = `redis://${passwordPart}${host}:${port}`
export default {
  host,
  port,
  password,
  url,
}
