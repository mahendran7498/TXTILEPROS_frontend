import { API_URL } from './constants'

export async function apiRequest(path, options = {}, token) {
  const controller = new AbortController()
  const timeoutMs = Number(options.timeoutMs || 0)
  const timeoutId = timeoutMs > 0
    ? setTimeout(() => controller.abort(new Error('Request timed out')), timeoutMs)
    : null

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The request took too long. Please try again.')
    }
    throw error
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Request failed')
  return data
}
