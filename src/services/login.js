import axios from 'axios'
const BASE_URL = '/api/login'

const login = async (newUser) => {
  const res = await axios.post(BASE_URL, newUser)
  return res.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { login }
