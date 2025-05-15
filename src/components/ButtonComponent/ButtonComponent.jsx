import React from 'react'
import {Button } from 'antd'
const ButtonCompoent = ({size,icon,styleButton,styleTextButton,textButton,...rest}) => {
  return (
        <Button 
            size= {size}
            // icon={<SearchOutlined />} 
            {...rest}
            style={styleButton}     
            >
            <span style={styleTextButton}> {textButton} </span>
        </Button>
  )
}

export default ButtonCompoent