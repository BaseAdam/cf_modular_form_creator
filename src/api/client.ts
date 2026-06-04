const BASE_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:5001'
).replace(/\/$/, '')

interface ApiErrorBody {
  message?: string
  details?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly details: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

type QueryValue = string | number | boolean | undefined

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${BASE_URL}${path}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

interface RequestOptions {
  method?: string
  query?: Record<string, QueryValue>
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', query, body } = options

  let response: Response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    throw new ApiError(
      'Network error: unable to reach the server.',
      0,
      error,
    )
  }

  const payload = await parseBody(response)

  if (!response.ok) {
    const errorBody = (payload ?? {}) as ApiErrorBody
    throw new ApiError(
      errorBody.message ?? `Request failed with status ${response.status}`,
      response.status,
      errorBody.details,
    )
  }

  return payload as T
}

export const http = {
  get: <T>(path: string, query?: Record<string, QueryValue>) =>
    request<T>(path, { query }),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
