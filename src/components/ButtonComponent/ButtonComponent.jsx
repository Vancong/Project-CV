import React from 'react'
import {Button } from 'antd'
const ButtonCompoent = ({size,icon=null,styleButton,styleTextButton,textButton,...rest}) => {
  return (
        <Button 
            size= {size}
            
            {...rest}
            style={styleButton}
            icon={icon}  
            >
            <span style={styleTextButton}> {textButton} </span>
        </Button>
  )
}

export default ButtonCompoent