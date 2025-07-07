import React, { useEffect, useState } from 'react'
import { Badge, Col, Popover } from 'antd';
import { WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './d';


import {UserOutlined,CaretDownOutlined,ShoppingCartOutlined,HeartOutlined } from '@ant-design/icons';
import "./header.scss";
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from "../../services/User.Service"
import { resetUser } from '../../redux/slices/UserSlice'


const HeaderCompoent = () => {
  const user=useSelector((state)=> state.user)
  const dispatch=useDispatch();
  const [userName,setUserName]=useState('');
  const [userAvt,setUserAvt]=useState('');

  const navigate =useNavigate();
  const handleNavigateLogin =() =>{
    navigate('/sign-in')
  }

  const handleLogout = async () =>{
    await UserService.logoutUser();
    dispatch(resetUser())
    
  }
  
  useEffect(() => {
    setUserName(user?.name);
    setUserAvt(user?.avt);
}, [user.name,user.avt]);


  const content= (
    <div>
    
      <p className='contentPopup' onClick={()=>navigate('/profile-user')}>Thông tin người dùng </p>
      <p className='contentPopup' onClick={handleLogout}>Đăng xuất </p>
    </div>
  )

  
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
            
                
                {user?.access_token ? (
                  <>
                      <Popover  content={content} trigger="click">
                         <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                            {userAvt ? (
                              <img className='avt-header' src={user.avt} />
                              ):(
                                <UserOutlined style={ {fontSize:"28px", marginLeft:"7px"}} />
                              )
                            }
                            <div> {userName?.length?userName:user?.email}</div>
                         </div>
                      </Popover>
                  </>
                ) : (
                     <div onClick={handleNavigateLogin} style={{cursor:'pointer'}}>
                          <span className='user_text'>Đăng nhập/Đăng ký</span>
                          <div>
                            <span className='user_text'>Tài khoản </span>
                            <CaretDownOutlined />
                          </div>
                     </div>
                )}  
               
            </div>
          
          </Col>
        </div>
    </div>
  )
}

export default HeaderCompoent