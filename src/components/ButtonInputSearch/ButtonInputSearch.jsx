import React, { useState } from 'react'

import {SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ButtonInputSearch = (props) => {

  const {size,placeholder,textButton,bgrColorInput ="#fff",bgrColorButton="#fff",
    textColorButton="#000000",onClickSearch,onChangeSearch,value}=props;

  const handleChange = (e) => {
    if (onChangeSearch) {
        onChangeSearch(e); 
    }

  };

  const handleSearch = () => {
    if (onClickSearch) {
      onClickSearch(value);
    }
  };
  return (
    <div style={{display:"flex"}}>
        <InputComponent 
            size= {size} 
            placeholder={placeholder} 
            style={{ background: bgrColorInput, width: 350}} 
            onChange={handleChange}
            value={value}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onClickSearch) {
                handleSearch()
              }
            }}
        />
        <ButtonComponent 
            size= {size}
            icon={<SearchOutlined />} 
            styleButton={{background: bgrColorButton}}
            textButton={textButton}
            styleTextButton={{color:textColorButton}}
            onClick={handleSearch}
            >
        </ButtonComponent>
    </div>
  )
}

export default ButtonInputSearch