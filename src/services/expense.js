import axios from 'axios'
const BASE_URL = 'http://localhost:3001/expense'

const create = async (expense) => {
  const res = await axios.post(BASE_URL, expense)
  return res.data
}

const update = async (expense) => {
  const res = await axios.put(BASE_URL, expense)
  return res.data
}

const getAll = async () => {
  const res = await axios.get(BASE_URL)
  //! Tengo q enviar el id
  return res.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { create, update, getAll }
