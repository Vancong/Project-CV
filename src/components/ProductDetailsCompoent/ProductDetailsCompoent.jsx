import React, { useState } from 'react'
import {Row,Col} from "antd";
import imageProduct from "../../assets/images/nuochoa.webp"
import slider1 from "../../assets/images/slide1.webp"
import slider2 from "../../assets/images/slide2.webp"
import SliderComponent from '../SliderComponent/SliderComponent';
import ButtonCompoent from '../ButtonComponent/ButtonComponent';
import {HeartOutlined } from '@ant-design/icons';
import { Fomater } from '../../utils/fomater';
import "./ProductDetailsCompoent.scss"


const ProductDetailsCompoent = () => {
  const capacityList = ['Chiết 10ml', 'Fullbox 100ml'];
  const [currentCapacity, setCapacity] = useState(capacityList[0]);
  const [quantity, setQuantity] = useState(1); 

  const onClick = (item) => {
    setCapacity(item);
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

  return (
    <Row>
      <Col span={10}>
        <SliderComponent arrImages={[imageProduct, slider1, slider2]} autoplay={false} />
      </Col>
      <Col span={12}>
        <div className='content_productDetail'>
          <h1 className='title_productDetail'>Valentino Donna EDP</h1>
          <p className='price_productDetail'>{Fomater(3000000)}</p>

          <label className='desc_productDetail'>
            Dung tích (ml): <span>{currentCapacity}</span>
          </label>

          <div className='capacityList'>
            {capacityList.map(item => (
              <div key={item} className='capacity' onClick={() => onClick(item)}>
                {item}
              </div>
            ))}
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
              <ButtonCompoent  
                              styleButton={{background: '#000000',fontWeight:'500',lineHeight:'28px',
                                            color: '#ffffff',padding:'30px 24px',border:'none',borderRadius:'4px',
                                            fontSize:'25px',width:'50%'

                              }}
                              textButton={'Thêm vào giỏ hàng'}
                               />
              
               <ButtonCompoent  
                              styleButton={{background: '#e30613',fontWeight:'500',lineHeight:'28px',
                                            color: '#ffffff',padding:'30px 24px',border:'none',borderRadius:'4px',
                                            fontSize:'25px',width:'50%'

                              }}
                              textButton={'Mua ngay'}
                               />
                 
          </div>
           <div className="btn-icon">
                <ButtonCompoent  
                styleButton={{background: '#fffff',fontWeight:'500',lineHeight:'28px',
                              color: '#bcb49',padding:'35px 24px',border:' 1px solid #000',borderRadius:'4px',
                              fontSize:'25px',width:'100%',marginTop:'20px'

                }}
                textButton={'Yêu thích'}
                icon={<HeartOutlined />}
          
                  />
           </div>
        </div>
      </Col>
    </Row>
  );
};

export default ProductDetailsCompoent