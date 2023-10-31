const apiBaseUrl = '/api/v2'
export async function fetchZingMp3(
  url: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<any> {
  return $fetch(url, {
    baseURL: `${apiBaseUrl}`,
    params,
  })
}

export function getHome(page: number): Promise<any> {
  return fetchZingMp3(`page/get/home`, { page, segmentId: -1, count: 30 })
}

export function getSongList(id: string) {
  return fetchZingMp3('page/get/playlist', { id })
}

export function getStreaming(id: string, isWorldWide = true) {
  return fetchZingMp3('song/get/streaming', { id, isWorldWide })
}
