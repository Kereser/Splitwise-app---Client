import axios from 'axios'
const BASE_URL = 'http://localhost:3001/expense'

export const create = async (expense) => {
  const res = await axios.post(BASE_URL, expense)
  return res.data
}
