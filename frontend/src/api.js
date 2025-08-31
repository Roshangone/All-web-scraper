import axios from 'axios'
const api = axios.create({ baseURL: '/api' })
export async function post(path, data, config = {}) {
  const resp = await api.post(path, data, config)
  return resp.data
}
export default { post }
