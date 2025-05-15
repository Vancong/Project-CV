import React from 'react'

import {SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
const ButtonInputSearch = (props) => {

  const {size,placeholder,textButton,bgrColorInput ="#fff",bgrColorButton="#fff",textColorButton="#000000"}=props;
  return (
    <div style={{display:"flex"}}>
        <InputComponent 
            size= {size} 
            placeholder={placeholder} 
            style={{ background: bgrColorInput}} 
        />
        <ButtonComponent 
            size= {size}
            icon={<SearchOutlined />} 
            styleButton={{background: bgrColorButton}}
            textButton={textButton}
            styleTextButton={{color:textColorButton}}
            >
        </ButtonComponent>
    </div>
  )
}

export default ButtonInputSearch