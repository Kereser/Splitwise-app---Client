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
  className,
}) {
  return (
    <FlexContainer pr={'0.1em'} orientation={orientation}>
      <div>{title}</div>
      <div>
        <SelectButtons
          value={selected}
          onChange={handleChange}
          id={id}
          className={className}
        >
          <option disabled value="" style={{ textAlign: 'start' }}>
            Select
          </option>
          {options.map((option) => {
            return (
              <React.Fragment key={option}>
                <option style={{ textAlign: 'start' }} value={option}>
                  {option}
                </option>
              </React.Fragment>
            )
          })}
        </SelectButtons>
      </div>
    </FlexContainer>
  )
}

export default Dropdown
