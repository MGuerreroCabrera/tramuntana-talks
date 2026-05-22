const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo completar la operación')
  }

  return data
}

export const apiRequest = async (path, token, options = {}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  return parseResponse(response)
}

export const getCollection = (resource, token) => apiRequest(`/api/${resource}`, token)

export const createResource = (resource, token, body) =>
  apiRequest(`/api/${resource}`, token, { method: 'POST', body })

export const updateResource = (resource, token, id, body) =>
  apiRequest(`/api/${resource}/${id}`, token, { method: 'PUT', body })

export const deleteResource = (resource, token, id) =>
  apiRequest(`/api/${resource}/${id}`, token, { method: 'DELETE' })

export const registerAttendeeToTalk = (token, attendeeId, talkId) =>
  apiRequest(`/api/attendees/${attendeeId}/talks/${talkId}`, token, { method: 'POST' })

export const unregisterAttendeeFromTalk = (token, attendeeId, talkId) =>
  apiRequest(`/api/attendees/${attendeeId}/talks/${talkId}`, token, { method: 'DELETE' })
