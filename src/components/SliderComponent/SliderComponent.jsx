import React from 'react'
import Slider from "react-slick"
import { Image } from 'antd';
import "./Slider.scss"
const SliderComponent = ({arrImages,autoplay}) => {
    let settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay:autoplay,
        autoplaySpeed:2000,
        arrows:true,
     
    };
  return (
    <Slider {...settings}  >
        {arrImages.map(image =>{
            return <Image src={image} alt="Slider" preview={false} width="100%" height="520px" />
        })}
    </Slider>
  )
}

export default SliderComponent