import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import ExpenseDetails from './ExpenseDetails'

test('Renders correct amount on details', () => {
  const expense = {
    balance: 100,
    date: '2022-05-24T01:29:41.383Z',
    debtors: [{ username: 'primero', amount: 50 }],
    paidBy: [{ username: 'segundo', amount: 50 }],
    description: 'to pr',
    id: '628c350545f21fae73b680fb',
  }

  render(
    <ExpenseDetails
      expense={expense}
      user={{
        username: 'primero',
        preferences: [{ expense, category: 'Casual' }],
      }}
      rate={1}
    />,
  )

  const el = screen.getByText('Current category of this expense:')
  expect(el).toBeDefined()
})
