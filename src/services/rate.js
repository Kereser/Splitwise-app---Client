import axios from 'axios'

const getRates = async (baseCurrency) => {
  const res = await axios.get(
    `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_API_KEY}/latest/${baseCurrency}`,
  )
  return res.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getRates }
