import React from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import "./style.scss";
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slide1 from "../../assets/images/slide1.webp";
import slide2 from "../../assets/images/slide2.webp";
import slide3 from "../../assets/images/slide3.webp";
import slide4 from "../../assets/images/slide4.webp";
import CardComponent from '../../components/CardComponent/CardComponent';
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent';
import { Button } from 'antd/es/radio';
import ButtonCompoent from '../../components/ButtonComponent/ButtonComponent';

const HomePage = () => {
  const arr=['Nuoc hoa nam',' nuoc hoa nu','Laptop'];
  return (
   <>
        <div className="menu_item">
          {arr.map( (product,index) =>{
            return <TypeProduct name={product} key={index} />
          })}
        </div>

        <SliderComponent  arrImages={[slide1,slide2,slide3,slide4]} autoplay={true} />
        <div className='container'>
            <div className='card'>
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent /> 
                <CardComponent />
                <CardComponent />

            </div>
            <div className='button_homePage'>
               <ButtonCompoent className="color-main button_hover"
                            textButton="Xem thêm" 
                            type="outline" 
                            styleTextButton={{fontWeight: 500}}
                            styleButton={{border: "1px solid",height:"38px" ,width:"120px"}} />
            </div>
          </div>
        homepage

   </>
  )
}

export default HomePage