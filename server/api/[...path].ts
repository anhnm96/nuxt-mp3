/* eslint-disable prettier/prettier */
import crypto from 'node:crypto'

// import { HttpsProxyAgent } from 'https-proxy-agent'

function getHash256(str: string) {
  return crypto.createHash('sha256').update(str).digest('hex')
}

function getHmac512(str: string, key: string) {
  const hmac = crypto.createHmac('sha512', key)
  // eslint-disable-next-line n/prefer-global/buffer
  return hmac.update(Buffer.from(str, 'utf8')).digest('hex')
}

export default defineEventHandler(async (event) => {
  const CTIME = Math.floor(Date.now() / 1000)
  const query = getQuery(event)
  const requestUrl = getRequestURL(event)
  // eslint-disable-next-line no-console
  console.log('Fetching API', requestUrl.pathname, requestUrl.search)

  const config = useRuntimeConfig()

  function hashParamNoId(path: string) {
    return getHmac512(
      path + getHash256(`ctime=${CTIME}version=${config.version}`),
      config.secretKey,
    )
  }

  function hashParamHome(path: string) {
    return getHmac512(
      path
        + getHash256(`count=30ctime=${CTIME}page=1version=${config.version}`),
      config.secretKey,
    )
  }

  function hashParam(path: string, id: string) {
    return getHmac512(
      path + getHash256(`ctime=${CTIME}id=${id}version=${config.version}`),
      config.secretKey,
    )
  }
  // const agent = new HttpsProxyAgent({
  //   host: config.proxyHost,
  //   port: config.proxyPort,
  //   auth: config.proxyAuth,
  // })

  let cookie: string
  function getCookie() {
    if (cookie) return cookie
    return $fetch.raw(config.apiUrl).then((res) => {
      cookie = res.headers.getSetCookie()[1]
      const startIndex = cookie.indexOf('Max-Age')
      const endIndex = cookie.indexOf(';', startIndex)
      const age = Number(cookie.slice(startIndex + 8, endIndex)) - 5
      setTimeout(() => {
        cookie = ''
      }, age)
      return cookie
    })
  }

  try {
    const cookie = await getCookie()
    const params = {
      apiKey: config.apiKey,
      version: config.version,
      ctime: CTIME,
      sig: requestUrl.pathname.includes('get/home')
        ? hashParamHome(requestUrl.pathname)
        : query.id
          ? hashParam(requestUrl.pathname, String(query.id))
          : hashParamNoId(requestUrl.pathname),
      // agent,
      ...query,
    }

    if (requestUrl.pathname.includes('/v1/web/ac-suggestions')) {
      return await $fetch('/v1/web/ac-suggestions', {
        baseURL: 'https://ac.zingmp3.vn',
        params,
        headers: {
          Cookie: cookie,
        },
      })
    }

    return await $fetch(requestUrl.pathname, {
      baseURL: config.apiUrl,
      params,
      headers: {
        Cookie: cookie,
      },
    })
  } catch (e: any) {
    const status = e?.response?.status || 500
    setResponseStatus(event, status)
    return {
      error: String(e),
    }
  }
})
