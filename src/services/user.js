import axios from 'axios'
const BASE_URL = 'http://localhost:3001/users'

export const create = async (newUser) => {
  const res = await axios.post(BASE_URL, newUser)
  return res.data
}
