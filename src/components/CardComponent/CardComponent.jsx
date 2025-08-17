import React, { useState } from 'react'
import { Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import "./CardComponent.scss"
import {Fomater} from "../../utils/fomater"
import {ShoppingCartOutlined,EyeOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom'
import *as CartService from "../../services/Cart.Service"
import { useMutationHook } from '../../hooks/useMutationHook'
import { useDispatch, useSelector } from 'react-redux'
import CartDrawerComponent from '../CartDrawerComponent/CartDrawerComponent'
import { addToCart } from '../../redux/slices/CartSlice'
import *as FavoriteService from "../../services/Favorite.Service"
import {toggleFavorite} from "../../redux/slices/FavoriteSlice"
import {alertError} from "../../utils/alert"
import getDiscountPrice from '../../utils/getDiscountPrice'
const CardComponent = (props) => {

  const {description,images=[],name,sizes=[],slug,product,state,width=null}=props;
  const navigate=useNavigate();
  const location=useLocation();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const user=useSelector(state => state.user);
  const productFavorites=(useSelector((state)=> state.favorite));
  const cart=useSelector(state => state.cart)
  const dispatch=useDispatch();

  
  
  const handleDetailProduct=(slug) =>{
    navigate(`/product-details/${slug}`,{state:{ category:state,product: name,slugCt:location.pathname}})
  }


  const mutationAddCart = useMutationHook( async({id,access_token,data}) =>{
         return await CartService.create(id,access_token,data);
  }) 

  const handlAddCart= (type="") =>{
    if(!user.access_token) {
      navigate('/sign-in',{state:location.pathname})
    }
    else {
      const checkCountInStock= product.sizes.find(item => item.volume===sizes[0].volume);
      const productCart=cart?.items?.find(item => item.product._id===product._id&&item.volume===sizes[0].volume)
      if(checkCountInStock.countInStock===0||checkCountInStock.countInStock<productCart?.quantity+1) {
        alertError(`Thất bại chỉ còn ${checkCountInStock.countInStock} sản phẩm `);
        return false;
      }
      const data={
        userId: user.id,
        productId:product._id,
        volume: sizes[0].volume,
        price:sizes[0].price,
        quantity: 1,
      }
      mutationAddCart.mutate({id:user?.id,access_token: user.access_token,data});
      
      let price= sizes[0].price;
      if(product.discount>0) {
        price=getDiscountPrice(price,product.discount)
      }
      
      dispatch(addToCart({
        product:product,
        quantity:1,
        volume:sizes[0].volume,
        price:price,
      }));
      if(type!=="navigateCart"){
          setIsOpenDrawer(true);
      }
    
    }
  }
  const handleBuy= () =>{
    const result= handlAddCart("navigateCart");
    if(result!==false) {
       navigate('/cart')
    }
   
  }

  const handleFavorite =async () => {
    if(!user.access_token) {
      navigate('/sign-in',{state:location.pathname})
      return
    }
    const data={
      userId:user?.id,
      productId: product._id
    }
    
    await FavoriteService.toggle(data,user?.access_token);
    dispatch(toggleFavorite(product._id))
  }

  const checkFavorite= productFavorites?.productIds?.length>0&& 
                       productFavorites?.productIds.includes(product?._id);


  return (
    <>
      <CartDrawerComponent open={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} />
      <Card
              hoverable
              style={{width: width ? width : 220}}
              className='card_item'
            
              cover={<img alt="example" onClick={() => handleDetailProduct(slug)} 
                    style={ {height:"220px",objectFit:"cover"}} src={images[0]} 
              />}
          >
          {product.discount>0&& (<p className='discount-product'>{`-${product.discount}%`}</p>) }
          <svg onClick={handleFavorite}  className={checkFavorite?'icon_love active' : 'icon_love'} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="tim-1" d="M12 4.59511C10.9104 3.59321 9.48421 3.03716 8.004 3.03711C7.22054 3.03793 6.44497 3.19367 5.72193 3.49538C4.9989 3.79709 4.34266 4.2388 3.791 4.79511C1.438 7.15811 1.439 10.8541 3.793 13.2071L11.125 20.5391C11.295 20.8381 11.623 21.0311 12 21.0311C12.1548 21.0296 12.3071 20.9918 12.4446 20.9208C12.5822 20.8498 12.7012 20.7475 12.792 20.6221L20.207 13.2071C22.561 10.8531 22.561 7.15811 20.205 4.79111C19.6536 4.23583 18.9979 3.79501 18.2756 3.49399C17.5532 3.19298 16.7785 3.03771 15.996 3.03711C14.5158 3.03735 13.0897 3.59338 12 4.59511Z" fill="white"></path>
              <path d="M12 4.59511C10.9104 3.59321 9.48421 3.03716 8.004 3.03711C7.22054 3.03793 6.44497 3.19367 5.72193 3.49538C4.9989 3.79709 4.34266 4.2388 3.791 4.79511C1.438 7.15811 1.439 10.8541 3.793 13.2071L11.125 20.5391C11.295 20.8381 11.623 21.0311 12 21.0311C12.1548 21.0296 12.3071 20.9918 12.4446 20.9208C12.5822 20.8498 12.7012 20.7475 12.792 20.6221L20.207 13.2071C22.561 10.8531 22.561 7.15811 20.205 4.79111C19.6536 4.23583 18.9979 3.79501 18.2756 3.49399C17.5532 3.19298 16.7785 3.03771 15.996 3.03711C14.5158 3.03735 13.0897 3.59338 12 4.59511ZM18.791 6.20511C20.354 7.77611 20.355 10.2301 18.793 11.7931L12 18.5861L5.207 11.7931C3.645 10.2301 3.646 7.77611 5.205 6.20911C5.965 5.45311 6.959 5.03711 8.004 5.03711C9.049 5.03711 10.039 5.45311 10.793 6.20711L11.293 6.70711C11.3858 6.80005 11.496 6.87379 11.6173 6.9241C11.7386 6.97441 11.8687 7.00031 12 7.00031C12.1313 7.00031 12.2614 6.97441 12.3827 6.9241C12.504 6.87379 12.6142 6.80005 12.707 6.70711L13.207 6.20711C14.719 4.69811 17.281 4.70211 18.791 6.20511Z" fill="black" className="tim-2"></path>
          </svg>

        <div className='product_order'> 
              <div className='icon_buy' onClick={handlAddCart}>
                  <ShoppingCartOutlined />
              </div>
              <button onClick={handleBuy}> Mua ngay</button>
              <div className='icon_detail' onClick={() => handleDetailProduct(slug)}>
                  <EyeOutlined />
              </div>
        </div>

        <div className='info_bottom'>
              <p className='product_title'>{name}</p>
              <p className='product_description'>{description}</p>
              
       
                <div className='product_price'>
                  {product.discount > 0 ? (
                    <>
                      <p className="old_price">{Fomater(sizes[0].price)}</p>  
                      <p className="new_price">
                          {Fomater(
                              getDiscountPrice(sizes[0].price,product.discount)
                            )}
                      </p>                           
                    </>
                  ) : (
                    Fomater(sizes[0].price)
                  )}
                </div>
        </div>
      </Card>
    </>
    
  )
}

export default CardComponent