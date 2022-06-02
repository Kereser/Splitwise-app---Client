import styled from 'styled-components'

export const Button = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${(props) =>
    props.primary
      ? '#6d33ff'
      : props.secundary
      ? '#7b1fa2'
      : props.warning
      ? '#e65100'
      : '#F4F0FF'};
  color: ${(props) =>
    props.primary
      ? '#F4F0FF'
      : props.secundary || props.warning
      ? '#fff'
      : '#6d33ff'};

  &:hover {
    background-color: ${(props) =>
      props.primary
        ? '#360d9d'
        : props.secundary
        ? '#560d74'
        : props.warning
        ? '#bb4200'
        : '#bcafdf'};
  }

  font-size: 1em;
  padding: 0.25em 1em;
  margin: 0.1em 0.3em;
  border: ${(props) =>
    props.primary
      ? '2px solid white'
      : props.secundary || props.warning
      ? '2px solid black'
      : '2px solid #6d33ff'};
  border-radius: 6px;
  cursor: pointer;
  display: inline-block;
`
