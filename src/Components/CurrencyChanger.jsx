//store
import useStore from '../store/state'
import Dropdown from './Dropdown'

function CurrencyChanger() {
  const toCurrency = useStore((state) => state.toCurrency)
  const setToCurrency = useStore((state) => state.setToCurrency)

  const handleChange = ({ target }) => {
    setToCurrency(target.value)
  }

  const options = ['USD', 'COP', 'EUR', 'ARS']

  return (
    <Dropdown
      id="currency-ddwn-filter"
      options={options}
      selected={toCurrency}
      handleChange={handleChange}
      title={'Currency'}
      orientation="column"
    />
  )
}

export default CurrencyChanger
