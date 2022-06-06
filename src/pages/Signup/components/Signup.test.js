import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Signup from './Signup'

describe('Validating inputs', () => {
  test('valid inputs', () => {
    render(<Signup />)
    userEvent.type(screen.getByPlaceholderText('Username'), 'tercero')
    userEvent.type(screen.getByPlaceholderText('Name'), 'tercerito')
    userEvent.type(screen.getByPlaceholderText('Password'), '1234')
    userEvent.click(screen.getByText('Create account'))
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  //Tengo q ver como puedo testear un llamado al backend
  // test('Entering non valid username', async () => {
  //   render(<Signup />)
  //   userEvent.type(screen.getByPlaceholderText('Username'), 'tercero')
  //   userEvent.click(screen.getByText('Create account'))

  //   const setAlert = jest.fn()
  //   expect(setAlert).toHaveBeenCalledTimes(1)
  // })
})
