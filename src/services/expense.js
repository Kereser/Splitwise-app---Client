import axios from 'axios'
const BASE_URL = '/api/expenses'

const create = async (expense) => {
  const res = await axios.post(BASE_URL, expense)
  return res.data
}

const update = async (expense, id) => {
  const res = await axios.put(`${BASE_URL}/${id}`, expense)
  return res.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { create, update }
