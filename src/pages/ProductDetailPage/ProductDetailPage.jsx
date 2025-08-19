import React from 'react'
import ProductDetailsCompoent from '../../components/ProductDetailsCompoent/ProductDetailsCompoent'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import NavigationPathComponent from '../../components/NavigationPathComponent/NavigationPathComponent'
import Footer from "../../components/Footer/Footer"
const ProductDetailPage = () => {
  const {slug}=useParams();
  const location=useLocation();
  const {state}=location;
  const navigate=useNavigate()
  return (

    <div className='container'>
      <NavigationPathComponent slugCt={state?.slugCt} category={state?.category} product={state?.product} />
      <ProductDetailsCompoent slug={slug} />
    </div>

  )
}

export default ProductDetailPage