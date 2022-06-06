import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import PartialPayDialog from './PartialPayDialog'

const expense = {
  balance: 100,
  date: '2022-05-24T01:29:41.383Z',
  debtors: [{ username: 'primero', amount: 50 }],
  paidBy: [{ username: 'segundo', amount: 50 }],
  description: 'to pr',
  id: '628c350545f21fae73b680fb',
}

const debtor = [{ username: 'primero', amount: 50 }]

const user = {
  username: 'primero',
  preferences: [{ expense, category: 'Casual' }],
}

const setup = () => {
  render(<PartialPayDialog expense={expense} debtor={debtor} user={user} />)
}

test('Can not pay more than total doubt', () => {
  setup()

  userEvent.click(screen.getByRole('button', { name: 'Parcial Pay' }))
  userEvent.type(screen.getByPlaceholderText('50'), '100')
  expect(screen.getByText("You can't pay more than $50")).toBeInTheDocument()
  expect(
    screen.queryByRole('button', { name: 'Accept' }),
  ).not.toBeInTheDocument()

  setup()
  userEvent.type(screen.getByPlaceholderText('50'), '-12')
  expect(screen.getByText('You must enter a valid value')).toBeInTheDocument()
  expect(
    screen.queryByRole('button', { name: 'Accept' }),
  ).not.toBeInTheDocument()
})

test('Can pay a correct amount', async () => {
  setup()

  userEvent.click(screen.getByRole('button', { name: 'Parcial Pay' }))
  userEvent.type(screen.getByPlaceholderText('50'), '20')
  const button = screen.getByRole('button', { name: 'Accept' })
  expect(button).toBeInTheDocument()
  userEvent.click(button)

  const ppalButton = await screen.findByRole('button', { name: 'Parcial Pay' })
  expect(ppalButton).toBeInTheDocument()
})

test('Can close the dialog', async () => {
  setup()

  userEvent.click(screen.getByRole('button', { name: 'Parcial Pay' }))

  userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

  const ppalButton = await screen.findByRole('button', { name: 'Parcial Pay' })
  expect(ppalButton).toBeInTheDocument()
})
