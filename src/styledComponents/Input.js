import styled from 'styled-components'

export const Input = styled.input.attrs((props) => ({
  type: props.type || 'text',
}))`
  placeholder: ${(props) => props.placeholder};
  font-size: 1em;
  line-height: 1.5;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0.2em 0 0.2em 0.5em;
  display: block;

  &:focus {
    outline: 1px solid #ccc;
  }
`
