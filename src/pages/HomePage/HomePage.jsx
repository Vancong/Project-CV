import React, { useEffect, useRef, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import "./style.scss";
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slide1 from "../../assets/images/slide1.webp";
import slide2 from "../../assets/images/slide2.webp";
import slide3 from "../../assets/images/slide3.webp";
import slide4 from "../../assets/images/slide4.webp";
import CardComponent from '../../components/CardComponent/CardComponent';
import NavbarComponent from '../../components/FilterSidebarComponent/FilterSidebarComponent';
import ButtonCompoent from '../../components/ButtonComponent/ButtonComponent';
import *as Product from "../../services/Product.Services";
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent"

const HomePage = () => {
  const searchProduct = useSelector(state => state.product.search);
  const [limit,setLimit]=useState(4); 
  const fetchProductAll= async (context) =>{
    const {limit,searchProduct: search}=context;
    const res= await Product.getAllProduct({search,limit});
    return res;
  }



  const { isLoading, data: products,isPreviousData } = useQuery({
    queryKey: ['products',{searchProduct,limit}],
    queryFn: ({ queryKey }) => {
      const [, context] = queryKey;
      return fetchProductAll(context); 
    },
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true
  });


  return (
   <>
     <LoadingComponent isPending={isLoading}>

        <SliderComponent type='banner' arrImages={[slide1,slide2,slide3,slide4]} autoplay={true} />
        <div className='container'>
            <div className='card'>
                {products?.data?.map((product) =>{
                  return (
                    <CardComponent 
                          key={product._id} 
                          countInStock={product.countInStock}
                          description={product.description}
                          images={product.images} 
                          name={product.name}
                          sizes={product.sizes}
                          type={product.type}
                          selled={product.selled}
                          disCount={product.disCount}
                          slug={product.slug}
                          id={product.id}
                          product={product}
                    />
                  )
                })}


            </div>
            <div className='button_homePage'>
               <ButtonCompoent className="color-main button_hover"
                            textButton={isPreviousData ? "Đang tải..." : "Xem thêm"}
                            type="outline" 
                            styleTextButton={{fontWeight: 500}}
                            styleButton={{border: "1px solid",height:"38px" ,width:"120px"}} 
                            onClick={ () => setLimit(pre => pre+4)}
                            disabled={products?.total === products?.data?.length}
               />
            </div>
          </div>
        homepage
     </LoadingComponent>
   </>
  )
}

export default HomePage