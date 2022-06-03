import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import ExpenseSummary from './ExpenseSummary'
// import { prettyDOM } from '@testing-library/dom's

test('Renders description', () => {
  const expense = {
    balance: 100,
    date: '2022-05-24T01:29:41.383Z',
    debtors: [{ username: 'primero', amount: 50 }],
    paidBy: [{ username: 'segundo', amount: 50 }],
    description: 'to pr',
    id: '628c350545f21fae73b680fb',
  }

  render(
    <ExpenseSummary
      expense={expense}
      user={{ username: 'primero' }}
      rate={1}
    />,
  )
  expect(screen.getByText('to pr')).toBeDefined()
  expect(screen.getByText('You lent')).toBeDefined()
})
