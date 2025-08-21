import { Button, Menu } from 'antd'
import React, { useState } from 'react'
import {UserOutlined,  AppstoreOutlined, 
  SettingOutlined,RadarChartOutlined,FireOutlined,BarcodeOutlined,ShopOutlined,BarChartOutlined ,UngroupOutlined} from '@ant-design/icons';
import { getItem } from '../../utils/menuUtils';
import HeaderCompoent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import "./AdminPage.scss"
import AdminBrand from '../../components/AdminBrand/AdminBrand';
import AdminNote from '../../components/AdminNote/AdminNote';
import AdminNoteGroup from '../../components/AdminNoteGroup/AdminNoteGroup';
import AdminVoucher from '../../components/AdminVoucher/AdminVoucher';
import AdminOrder from '../../components/AdminOrder/AdminOrder';
import AdminWebInfo from '../../components/AdminWebInfo/AdminWebInfo';
import AdminStats from '../../components/AdminStats/AdminStats';
const AdminPage = () => {
const items = [
  getItem('Thống kê', 'stats', <BarChartOutlined />),
  getItem('Quản lý đơn hàng', 'order', <ShopOutlined />),
  getItem('Mã giảm giá', 'voucher',<BarcodeOutlined />),
  getItem('Sản phẩm', 'product', <AppstoreOutlined />),
  getItem('Người dùng', 'user', <UserOutlined />,),
  getItem('Thương Hiệu', 'brand',<RadarChartOutlined />),
  getItem('Note ', 'note',<FireOutlined />),
  getItem('Nhóm hương', 'note-group',<UngroupOutlined />),
  getItem('Thông tin website', 'webinfo', <SettingOutlined />),

]
  const rootSubmenuKeys=['user','product']
  const [keySelected,setKeySelected]= useState(localStorage.getItem('adminKey') || 'stats');
  const renderPage= (key) =>{
    switch(key) {

      case ('stats'):
        return <AdminStats />
      case ('user'):
        return (
          <AdminUser />
        )

      case ('order'):
      return (
        <AdminOrder />
      )

    
      case ('product'):
        return (
          <AdminProduct />

        )

      case('webinfo'):
        return(
          <AdminWebInfo />
        )

      case ('voucher'):
        return (
          <AdminVoucher />

        )
      case ('brand'):
        return (
          <AdminBrand />

        )
      case ('note'):
        return (
          <AdminNote />

      )

      case ('note-group'):
        return (
          <AdminNoteGroup />

        )
      
      default :
        return <></>
    }

  }
  const handleOnclick = ({key}) =>{
    setKeySelected(key)
    localStorage.setItem('adminKey', key); 
  }
  return (
    <>
      <HeaderCompoent  isHiddenSearch={true} isHiddenCart={true} isHiddenMenu={true} isHiddenFavorite={true} />
      <div className='admin_page' style={{height:'100vh'}}>
        <Menu
          mode='inline'
          style={{
            width:256,
            boxShadow:'1px 1px 2px #ccc',
            height:'calc(100vh - 50px)',
            position: 'fixed',
            left: 0,
            top: 90, 

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