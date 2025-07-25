import { Button, Menu } from 'antd'
import React, { useState } from 'react'
import {UserOutlined,  AppstoreOutlined, SettingOutlined} from '@ant-design/icons';
import { getItem } from '../../utils/menuUtils';
import HeaderCompoent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import "./AdminPage.scss"
const AdminPage = () => {
const items = [
  getItem('Sản phẩm', 'product', <AppstoreOutlined />),
    getItem('Người dùng', 'user', <UserOutlined />,),
  getItem('Navigation Three1', 'sub4', <SettingOutlined />),
  // getItem('Navigation Three2', 'sub5', <SettingOutlined />),
  // getItem('Navigation Three3', 'sub6', <SettingOutlined />),
  // getItem('Navigation Three4', 'sub7', <SettingOutlined />)
]
  const rootSubmenuKeys=['user','product']
  const [keySelected,setKeySelected]= useState('');
  const renderPage= (key) =>{
    switch(key) {
      case ('user'):
        return (
          <AdminUser />
        )
      
      case ('product'):
        return (
          <AdminProduct />

        )
      
      default :
        return <></>
    }

  }
  const handleOnclick = ({key}) =>{
    setKeySelected(key)
  }
  return (
    <>
      <HeaderCompoent  isHiddenSearch={true} isHiddenCart={true} isHiddenFavorite={true} />
      <div className='admin_page'>
        <Menu
          mode='inline'
          style={{
            width:256,
            boxShadow:'1px 1px 2px #ccc',
            height:'calc(100vh - 50px)',

          }}
          items={items}
          onClick={handleOnclick}
        />
        <div className='content' >
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  )
}

export default AdminPage