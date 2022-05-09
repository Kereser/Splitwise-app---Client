import axios from 'axios'
const BASE_URL = 'http://localhost:3001/users'

const create = async (newUser) => {
  const res = await axios.post(BASE_URL, newUser)
  return res.data
}

const update = async (user) => {}

const getOneUser = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`)
  return res.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { create, update, getOneUser }
