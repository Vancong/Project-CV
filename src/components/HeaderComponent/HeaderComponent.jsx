import React from 'react'
import { Badge, Col } from 'antd';
import { WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './d';
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
import {UserOutlined,CaretDownOutlined,ShoppingCartOutlined,HeartOutlined } from '@ant-design/icons';
import "./header.scss";
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
const { Search } = Input;

const HeaderCompoent = () => {
  return (
    <div className='ok'>
        <div className='header_top container'>
          <Col span={6}>
             <WrapperTextHeader>VanCong88</WrapperTextHeader>
          </Col>
          <Col span={12}>
              <ButtonInputSearch className="serach_header"
                placeholder="Vui lòng nhập tên sản phẩm để tìm kiếm"
                allowClear
                size="large"
                onSearch
                textButton="Tìm Kiếm"
              />
          </Col>
          <Col span={6}>
           
            <div className='user'>
                <div style={ {fontSize:"28px"}}>   
                    <HeartOutlined style={{margin:" 0 10px"}} />
                    <Badge count={4} size='small' >
                      <ShoppingCartOutlined style={{fontSize:'31px'}} />
                    </Badge>
                </div>

                <UserOutlined style={ {fontSize:"28px", marginLeft:"7px"}} />
                <div>
                    <span className='user_text'>Đăng nhập/Đăng ký</span>
                    <div>
                      <span className='user_text'>Tài khoản </span>
                      <CaretDownOutlined />

                    </div>
                </div>
            </div>
          
          </Col>
        </div>
    </div>
  )
}

export default HeaderCompoent