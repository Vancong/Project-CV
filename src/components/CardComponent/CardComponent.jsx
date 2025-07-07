import React from 'react'
import { Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import "./CardComponent.scss"
import {Fomater} from "../../utils/fomater"
import {ShoppingCartOutlined,EyeOutlined } from '@ant-design/icons';
const CardComponent = (props) => {
  const {description,image,name,price,selled}=props;
  return (
    <Card
            hoverable
            style={{ width: 240 }}
            className='card_item'
            
            cover={<img alt="example"  style={ {height:"220px",objectFit:"cover"}} src={image} />}
        >
        {selled&& (<p className='selled-product'>{`-${selled}%`}</p>) }
        <svg className='icon_love' width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="tim-1" d="M12 4.59511C10.9104 3.59321 9.48421 3.03716 8.004 3.03711C7.22054 3.03793 6.44497 3.19367 5.72193 3.49538C4.9989 3.79709 4.34266 4.2388 3.791 4.79511C1.438 7.15811 1.439 10.8541 3.793 13.2071L11.125 20.5391C11.295 20.8381 11.623 21.0311 12 21.0311C12.1548 21.0296 12.3071 20.9918 12.4446 20.9208C12.5822 20.8498 12.7012 20.7475 12.792 20.6221L20.207 13.2071C22.561 10.8531 22.561 7.15811 20.205 4.79111C19.6536 4.23583 18.9979 3.79501 18.2756 3.49399C17.5532 3.19298 16.7785 3.03771 15.996 3.03711C14.5158 3.03735 13.0897 3.59338 12 4.59511Z" fill="white"></path>
            <path d="M12 4.59511C10.9104 3.59321 9.48421 3.03716 8.004 3.03711C7.22054 3.03793 6.44497 3.19367 5.72193 3.49538C4.9989 3.79709 4.34266 4.2388 3.791 4.79511C1.438 7.15811 1.439 10.8541 3.793 13.2071L11.125 20.5391C11.295 20.8381 11.623 21.0311 12 21.0311C12.1548 21.0296 12.3071 20.9918 12.4446 20.9208C12.5822 20.8498 12.7012 20.7475 12.792 20.6221L20.207 13.2071C22.561 10.8531 22.561 7.15811 20.205 4.79111C19.6536 4.23583 18.9979 3.79501 18.2756 3.49399C17.5532 3.19298 16.7785 3.03771 15.996 3.03711C14.5158 3.03735 13.0897 3.59338 12 4.59511ZM18.791 6.20511C20.354 7.77611 20.355 10.2301 18.793 11.7931L12 18.5861L5.207 11.7931C3.645 10.2301 3.646 7.77611 5.205 6.20911C5.965 5.45311 6.959 5.03711 8.004 5.03711C9.049 5.03711 10.039 5.45311 10.793 6.20711L11.293 6.70711C11.3858 6.80005 11.496 6.87379 11.6173 6.9241C11.7386 6.97441 11.8687 7.00031 12 7.00031C12.1313 7.00031 12.2614 6.97441 12.3827 6.9241C12.504 6.87379 12.6142 6.80005 12.707 6.70711L13.207 6.20711C14.719 4.69811 17.281 4.70211 18.791 6.20511Z" fill="black" class="tim-2"></path>
        </svg>

       <div className='product_order'> 
            <div className='icon_buy'>
                <ShoppingCartOutlined />
            </div>
            <button> Mua ngay</button>
            <div className='icon_detail'>
                <EyeOutlined />
            </div>
       </div>

       <div>
            <p className='product_title'>{name}</p>
            <p className='product_description'>{description}</p>
            <p className='product_price'>{Fomater(price)}</p>
       </div>
    </Card>
    
  )
}

export default CardComponent