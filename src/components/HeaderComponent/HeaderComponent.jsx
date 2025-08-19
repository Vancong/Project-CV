import React, { useEffect, useState } from 'react'
import { Badge, Col, Popover } from 'antd';
import SearchAutoComponent from '../SearchAutoComponent/SearchAutoComponent';
import {UserOutlined,CaretDownOutlined,ShoppingCartOutlined,HeartOutlined } from '@ant-design/icons';
import "./header.scss";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from "../../services/User.Service"
import { resetUser } from '../../redux/slices/UserSlice'
import CartDrawerComponent from '../CartDrawerComponent/CartDrawerComponent';
import { clearCart } from '../../redux/slices/CartSlice';
import { resetFavorite } from '../../redux/slices/FavoriteSlice';
import TypeProduct from "../TypeProduct/TypeProduct"
import MegaDropdownComponent from '../MegaDropdownComponent/MegaDropdownComponent';
import {setSearch} from "../../redux/slices/ProductSlice.js"
const HeaderCompoent = ({isHiddenFavorite=false,isHiddenCart=false,isHiddenSearch=false,isHiddenMenu=false}) => {
  const user=useSelector((state)=> state.user)
  const cart=useSelector((state) =>state.cart)
  const favorite= useSelector((state)=> state.favorite)


  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const dispatch=useDispatch();
  const [userName,setUserName]=useState('');
  const [userAvt,setUserAvt]=useState('');
  const [selected, setSelected] = useState(null);
  const websiteInfo=useSelector(state =>state.websiteInfo)
  
  const navigate =useNavigate();
  const handleNavigateLogin =() =>{
    navigate('/sign-in')
  }

  const handleLogout = async () =>{
    localStorage.removeItem('access_token');
    dispatch(resetUser());
    dispatch(clearCart())
    dispatch(resetFavorite())
    await UserService.logoutUser();
    
  }
  
  useEffect(() => {
    setUserName(user?.name);
    setUserAvt(user?.avt);
}, [user.name,user.avt]);


  const content= (
    <div>
      {user.isAdmin&& 
        <p className='contentPopup' onClick={()=>navigate('/admin/dashboard')}>Quản lý hệ thống</p>
      } 
      <p className='contentPopup' onClick={()=>navigate('/profile-user')}>Thông tin người dùng </p>
      <p className='contentPopup' onClick={()=>navigate('/my-order')}>Đơn hàng của tôi </p>
      <p className='contentPopup' onClick={handleLogout}>Đăng xuất </p>
    </div>
  )
  const itemsMenu=['Trang chủ','Deal thơm', 'Nước hoa nam','Nước hoa nữ',
    'Nước hoa Unisex','Note hương','Thương hiệu'];
 
 
      
  
return (
    <div className='header'>
        <div className='header_top ' 
            style={{justifyContent: isHiddenSearch&& isHiddenFavorite ?'space-between': 'unset'}}
        >
          <Col span={6} >
            <div style= {{display:'flex',alignItems:'flex-end',gap:10}}> 
              <img src={websiteInfo?.logo} alt="logo" style={{width:50,height:50,objectFit:'cover',cursor:'pointer'}}
                onClick={()=> navigate('/')}
              />
              <h2 style={{cursor:'pointer'}}  onClick={()=> navigate('/')}>{websiteInfo?.name}</h2>
             </div>
          </Col>
          {!isHiddenSearch&&(
            <Col span={14} style={{marginRight:10,marginLeft:-100}}>
              <SearchAutoComponent />

            </Col>
          )}
         
          <Col span={6}>
           
            <div className='user'>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px',marginLeft:'16px' }}>   
                   {!isHiddenFavorite&&user?.access_token &&(
                    <Badge  count={favorite?.total||0} size='small' 
                            onClick={()=> {
                              if(!user?.access_token){
                                navigate('/login',{state:'/type/favorite'})
                              }
                              else {
                                 navigate('/type/favorite')
                              }
                             
                            }}
                    >
                      <span>
                         <HeartOutlined style={{fontSize:'29px'}} />
                      </span>
                    </Badge>
                   )}
                   {!isHiddenCart&&user?.access_token && (
                        <Badge count={cart?.total||0} size='small' >
                          <span onClick={()=>setIsOpenDrawer(true)} >
                            <ShoppingCartOutlined style={{fontSize:'28px'}} />
                          </span>
                        </Badge> 
                   )}
                </div>

                <CartDrawerComponent open={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} />
                
                {user?.access_token ? (
                  <>
                      <Popover  content={content} trigger="click">
                         <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                            {userAvt ? (
                              <img className='avt-header' alt={user.avt} src={user.avt} />
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
        
        {!isHiddenMenu &&(
            <ul className="menu_item">
              {itemsMenu.map((product, index) => (
                <li key={index}  className={`menu_item_li ${selected === product ? 'active' : ''}`}
                    onClick={() =>{
                      setSelected(product)
                      dispatch(setSearch(''))
                      
                    }}
                    style={product === 'Deal thơm' ? { color: '#f73123' } : {}}
                >
                  {product === 'Note hương' || product === 'Thương hiệu' ? (
                    <MegaDropdownComponent
                      title={product}
                      type={product === 'Thương hiệu' ? 'brands' : 'notes'}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  ) : (         
                      <TypeProduct name={product} /> 
                  )}
                </li>
              ))}
            </ul>
        )}
      


    </div>
  )
}

export default HeaderCompoent