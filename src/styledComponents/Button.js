import styled from 'styled-components'

export const Button = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${(props) => (props.primary ? '#6d33ff' : '#F4F0FF')};
  color: ${(props) => (props.primary ? '#F4F0FF' : '#6d33ff')};

  &:hover {
    background-color: ${(props) => (props.primary ? '#360d9d' : '#bcafdf')};
  }

  font-size: 1em;
  padding: 0.25em 1em;
  border: ${(props) =>
    props.primary ? '2px solid white' : '2px solid #6d33ff'};
  border-radius: 6px;
  cursor: pointer;
`
