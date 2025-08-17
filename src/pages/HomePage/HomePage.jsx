import React, { useEffect, useRef, useState } from 'react'
import "./style.scss";
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slide1 from "../../assets/images/slide1.webp";
import slide2 from "../../assets/images/slide2.webp";
import slide3 from "../../assets/images/slide3.webp";
import slide4 from "../../assets/images/slide4.webp";
import { useQuery } from '@tanstack/react-query';
import ProductListSection from "../../components/ProductListSection/ProductListSection";
const HomePage = () => {

  return (
   <>

        <SliderComponent type='banner' arrImages={[slide1,slide2,slide3,slide4]} autoplay={true} />
        <div className='container home_page'>

            <ProductListSection 
                title="Sản phẩm đang trong thời gian khuyến mãi" 
                queryKey="saleProducts" 
                keySort="discount" 
                valueSort={-1} 
              />

              <ProductListSection 
                title="Sản phẩm mới nhất" 
                queryKey="newProducts" 
                keySort="createdAt" 
                valueSort={-1} 
              />
          </div>
   </>
  )
}

export default HomePage