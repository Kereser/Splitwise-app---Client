import { Button } from '../../../styledComponents/Button'
import styled from 'styled-components'

export const ExpenseButton = styled(Button)`
  padding: 0.15em 0.5em;
  margin: 0 0.3em;

  &:hover {
    background-color: ${(props) => (props.primary ? '#360d9d' : '#bcafdf')};
  }
`
