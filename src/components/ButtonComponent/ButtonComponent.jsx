import React from 'react'
import {Button } from 'antd'
const ButtonComponent = ({size,icon=null,styleButton,styleTextButton,textButton,disabled,...rest}) => {
  return (
        <Button 

            style={{
              ...styleButton,
              background: disabled ? '#ccc' : styleButton.background,
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
            size= {size}
            icon={icon}  
            disabled={disabled}
      
            {...rest}
            >
            <span style={styleTextButton}> {textButton} </span>
        </Button>
  )
}

export default ButtonComponent