import React from 'react'

import { FlexContainer } from '../styledComponents/FlexContainer'
import { SelectButtons } from '../styledComponents/SelectButtons'

function Dropdown({
  options,
  title,
  selected,
  handleChange,
  orientation = null,
  id,
}) {
  return (
    <FlexContainer pr={'0.1em'} orientation={orientation}>
      <div>{title}</div>
      <div>
        <SelectButtons value={selected} onChange={handleChange} id={id}>
          <option disabled value={''} style={{ textAlign: 'start' }}>
            Select
          </option>
          {options.map((option, i) => {
            return (
              <React.Fragment key={i}>
                <option style={{ textAlign: 'start' }}>{option}</option>
              </React.Fragment>
            )
          })}
        </SelectButtons>
      </div>
    </FlexContainer>
  )
}

export default Dropdown
