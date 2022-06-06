import styled from 'styled-components'

export const FlexContainer = styled.div.attrs((props) => ({
  justifyContent: props.justifyContent || 'center',
  pr: props.pr || '1.5em',
  orientation: props.orientation || 'row',
  pu: props.pu || '.5em',
  alignItems: props.alignItems || 'center',
}))`
  display: flex;
  flex-direction: ${(props) => props.orientation};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  padding: ${(props) => props.pu} ${(props) => props.pr};
`
