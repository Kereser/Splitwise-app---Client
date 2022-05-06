import axios from 'axios'
const BASE_URL = 'http://localhost:3001/login'

export const login = async (newUser) => {
  const res = await axios.post(BASE_URL, newUser)
  return res.data
}
