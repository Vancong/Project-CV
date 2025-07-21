import React from 'react'

import {SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
const ButtonInputSearch = (props) => {

  const {size,placeholder,textButton,bgrColorInput ="#fff",bgrColorButton="#fff",
    textColorButton="#000000",onChangeSearch,onClickSearch}=props;
  return (
    <div style={{display:"flex"}}>
        <InputComponent 
            size= {size} 
            placeholder={placeholder} 
            style={{ background: bgrColorInput, width: 350}} 
            onChange={onChangeSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onClickSearch) {
                onClickSearch()
              }
            }}
        />
        <ButtonComponent 
            size= {size}
            icon={<SearchOutlined />} 
            styleButton={{background: bgrColorButton}}
            textButton={textButton}
            styleTextButton={{color:textColorButton}}
            onClick={onClickSearch}
            >
        </ButtonComponent>
    </div>
  )
}

export default ButtonInputSearch