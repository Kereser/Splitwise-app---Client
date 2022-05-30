//Mui components
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'

//Mui Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

//state
import useStore from '../store/state'

//components
import ExpenseDetails from './ExpenseDetails'
import ExpenseSummary from './ExpenseSummary'

function Expense({ expense, rate }) {
  const user = useStore((state) => state.user)

  //Mui styles
  const accordionSummaryStyle = {
    borderRadius: '0',
    backgroundColor: '#fff',
    margin: '2px 0',
  }

  const accordingDetailsStyle = {
    backgroundColor: '#f8f8f8',
    padding: '10px 5px',
  }

  return (
    <Accordion style={accordionSummaryStyle}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        id="expense-summary"
        style={{ padding: '0px 3px 0px 0px', height: '30px' }}
      >
        <ExpenseSummary expense={expense} user={user} rate={rate} />
      </AccordionSummary>
      <AccordionDetails style={accordingDetailsStyle}>
        <ExpenseDetails user={user} expense={expense} rate={rate} />
      </AccordionDetails>
    </Accordion>
  )
}

export default Expense
