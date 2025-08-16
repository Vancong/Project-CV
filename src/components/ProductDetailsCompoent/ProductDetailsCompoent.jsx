import React, { useState,useEffect} from 'react'
import {Row,Col} from "antd";
import SliderComponent from '../SliderComponent/SliderComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import {HeartOutlined } from '@ant-design/icons';
import { Fomater } from '../../utils/fomater';
import "./ProductDetailsCompoent.scss"
import * as ProductService from "../../services/Product.Services"
import { useQuery } from '@tanstack/react-query';
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent"
import { useSelector } from 'react-redux';
import ProductTabsComponent from './ProductTabsComponent/ProductTabsComponent';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import *as CartService from '../../services/Cart.Service'
import {useMutationHook} from "../../hooks/useMutationHook"
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/CartSlice';
import CartDrawerComponent from '../CartDrawerComponent/CartDrawerComponent';
import *as FavoriteService from "../../services/Favorite.Service"
import {toggleFavorite} from "../../redux/slices/FavoriteSlice"
import {alertError, alertSuccess} from "../../utils/alert"
import getDiscountPrice from '../../utils/getDiscountPrice';
const ProductDetailsCompoent = ({slug}) => {
  const [currentSize, setCurrentSize] = useState(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [quantity, setQuantity] = useState(1); 
  const user=useSelector(state => state.user);
  const productFavorites=useSelector(state =>state.favorite);
  const cart=useSelector(state => state.cart)
  const navigate=useNavigate();
  const location=useLocation();
  const dispatch=useDispatch();

  const fetchGetDetailProduct= async(slug) =>{
    const res=await ProductService.getDetailProduct(slug) 
    return res.data;
  }

  const { isLoading, data: product } = useQuery({
    queryKey: ['product-detail',slug],
    queryFn: () => fetchGetDetailProduct(slug)
    ,
    enabled: !!slug
  });

  useEffect(() => {
    if (product?.sizes?.length > 0 && !currentSize) {
      setCurrentSize(product.sizes[0]);
    }
  }, [product, currentSize]);

  const onClick = (item) => {
    setCurrentSize(item);
    setQuantity(1)
  };



  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleChange = (e) => {
    setQuantity(e.target.value); 
  };

  const handleBlur = () => {
    const value = parseInt(quantity);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };
  
  const mutationAddCart = useMutationHook( async({id,access_token,data}) =>{
          return await CartService.create(id,access_token,data);
  }) 


  const handlAddCart= (type='') =>{
    if(!user.access_token) {
      navigate('/sign-in',{state:location.pathname})
    }
    else {
      if(!currentSize) {
          return;
      }
      const checkCountInStock= product.sizes.find(item => item.volume===currentSize.volume);
      const productCart=cart?.items?.find(item => item.product._id===product._id&&item.volume===currentSize.volume)
      if(checkCountInStock.countInStock===0|| productCart?.quantity+quantity>checkCountInStock.countInStock) {
        alertError(`Thất bại. Chỉ còn ${checkCountInStock.countInStock} sản phẩm `);
        return;
      }
      const data={
        userId: user.id,
        productId:product._id,
        volume: currentSize.volume,
        price:currentSize.price,
        quantity: quantity,
      }
      mutationAddCart.mutate({id:user?.id,access_token: user.access_token,data});

      dispatch(addToCart({
        product:product,
        quantity:quantity,
        volume: currentSize.volume,
        price: currentSize.price,
      }));
      if(type==='navigate_cart') {
        navigate('/cart')
      }
      else {
          setIsOpenDrawer(true);
      }
    
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
    <LoadingComponent isPending={isLoading}>
      <Row >
        <CartDrawerComponent  open={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} />
        <Col span={10}>
          <SliderComponent arrImages={product?.images||[]} autoplay={false} />
        </Col>
        <Col span={12}>
          <div className='content_productDetail'>
            <h1 className='title_productDetail'>{product?.name}</h1>

           <p className='price_productDetail'>
              {currentSize ? (
                product.discount > 0 ? (
                  <div className='priceDiscount'>
                    <p className="old_price">{Fomater(currentSize.price)}</p> 
                    <p className="new_price">
                      {Fomater(
                        getDiscountPrice(currentSize.price,product.discount)
                      )}
                    </p>
                    
                  </div>
                ) : (
                  Fomater(currentSize.price)
                )
              ) : (
                'Chọn dung tích'
              )}
            </p>


            <label className='desc_productDetail'>
              Dung tích (ml): <span>{ currentSize?.volume ?`${currentSize?.volume }ml`: 'Chưa chọn'}</span>
            </label>

              <div className="sizes">
                {product?.sizes?.map(size => {
                  const finalPrice = product.discount
                    ? size.price * (1 - product.discount / 100)
                    : size.price;

                  return (
                    <div
                      key={size._id}
                      onClick={() => onClick(size)}
                      className={`size ${currentSize?._id === size._id ? 'active' : ''}`}
                    >
                      {size.volume}ml - {Fomater(finalPrice)}
                      
                    </div>
                  );
                })}
            </div>

            <div className='quantity'>
              <div>Số lượng</div>
              <div>
                <input type="button" value="-" className="minus" onClick={handleDecrease} />
                <input
                  type="number"
                  className="quantity_text"
                  name="quantity"
                  value={quantity}
                  min="1"
                  step="1"
                  inputMode="numeric"
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <input type="button" value="+" className="plus" onClick={handleIncrease} />
              </div>
            </div>
            <div className='btn-shopping'>
                <ButtonComponent  
                                styleButton={{background: '#000000',fontWeight:'500',lineHeight:'28px',
                                              color: '#ffffff',padding:'30px 24px',border:'none',borderRadius:'4px',
                                              fontSize:'25px',width:'50%'

                                }}
                                onClick={handlAddCart}
                                textButton={'Thêm vào giỏ hàng'}
                                />
                
                <ButtonComponent  
                                styleButton={{background: '#e30613',fontWeight:'500',lineHeight:'28px',
                                              color: '#ffffff',padding:'30px 24px',border:'none',borderRadius:'4px',
                                              fontSize:'25px',width:'50%'

                                }}
                                onClick={()=> handlAddCart('navigate_cart')}
                                textButton={'Mua ngay'}
                                />
                  
            </div>
            <div className= {checkFavorite? 'btn-icon active': 'btn-icon'} >
                  <ButtonComponent  
                  styleButton={{background: '#fffff',fontWeight:'500',lineHeight:'28px',
                                color: '#bcb49',padding:'35px 24px',border:' 1px solid #000',borderRadius:'4px',
                                fontSize:'25px',width:'100%',marginTop:'20px'

                  }}
                  textButton={'Yêu thích'}
                  icon={<HeartOutlined />}
                  onClick={handleFavorite}
            
                    />
            </div>
          </div>
        </Col>
      </Row>
      {product&& <ProductTabsComponent product={product} />}
    </LoadingComponent>
  );
};

export default ProductDetailsCompoent