import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Login from './Login'

describe('Non valid parameters', () => {
  test('valid user', async () => {
    render(<Login />)
    userEvent.type(screen.getByPlaceholderText('Username'), 'primero')
    userEvent.type(screen.getByPlaceholderText('Password'), '1234')
    userEvent.click(screen.getByRole('button', { name: 'Log-in' }))
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  test('Non valid username', async () => {
    render(<Login />)
    userEvent.type(screen.getByPlaceholderText('Username'), 'pr')
    userEvent.click(screen.getByRole('button', { name: 'Log-in' }))
    const modal = await screen.findByTestId('modal')
    expect(modal).toBeInTheDocument()
  })
})
