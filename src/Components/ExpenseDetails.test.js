import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// import { prettyDOM } from '@testing-library/dom'

import ExpenseDetails from './ExpenseDetails'

const expense = {
  balance: 100,
  date: '2022-05-24T01:29:41.383Z',
  debtors: [{ username: 'primero', amount: 50 }],
  paidBy: [{ username: 'segundo', amount: 50 }],
  description: 'to pr',
  id: '628c350545f21fae73b680fb',
}

const user = {
  username: 'primero',
  preferences: [{ expense, category: 'Casual' }],
}

const setup = () => {
  render(<ExpenseDetails expense={expense} user={user} rate={1} />)
}

test('User can select an option for the categeory and button appears', () => {
  setup()

  expect(
    screen.queryByRole('button', { name: 'Set Category' }),
  ).not.toBeInTheDocument()
  expect(screen.getAllByRole('option').length).toBe(4)

  userEvent.selectOptions(
    screen.getByRole('combobox'),
    screen.getByRole('option', { name: 'Casual' }),
  )
  expect(screen.getByRole('option', { name: 'Casual' }).selected).toBe(true)
  expect(screen.getByRole('option', { name: 'Important' }).selected).toBe(false)

  expect(screen.getByText('Set Category')).toBeInTheDocument()
})

test('Can pay total amount', async () => {
  setup()

  window.confirm = jest.fn(() => true)

  const button = screen.getByText('Total pay')
  userEvent.click(button)

  expect(window.confirm).toHaveBeenCalledTimes(1)
})
