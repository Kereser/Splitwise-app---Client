import axios from 'axios'
const BASE_URL = '/api/users'

const create = async (newUser) => {
  const res = await axios.post(BASE_URL, newUser)
  return res.data
}

const update = async (user, id) => {
  const res = await axios.put(`${BASE_URL}/${id}`, user)
  return res.data
}

const getOneUser = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`)
  return res.data
}

const getAll = async () => {
  const res = await axios.get(BASE_URL)
  return res.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { create, update, getOneUser, getAll }
