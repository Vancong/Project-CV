import React from 'react'
import MyOrderComponent from '../../components/MyOrderComponent/MyOrderComponent'
import ProductListSection from '../../components/ProductListSection/ProductListSection'

const MyOrderPage = () => {
  return (
    <div className='container'>
        <MyOrderComponent />
         <ProductListSection 
          title="Sản phẩm đang trong thời gian khuyến mãi" 
          queryKey="saleProducts" 
          keySort="discount" 
          valueSort={-1} 
        />
    </div>
  )
}

export default MyOrderPage