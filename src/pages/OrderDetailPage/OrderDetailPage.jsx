import React from 'react'
import OrderDetailComponent from '../../components/OrderDetailComponent/OrderDetailComponent'
import ProductListSection from '../../components/ProductListSection/ProductListSection'

const OrderDetailPage = () => {
  return (
    <div className='container'>
      <OrderDetailComponent/>
       <ProductListSection 
          title="Sản phẩm đang trong thời gian khuyến mãi" 
          queryKey="saleProducts" 
          keySort="discount" 
          valueSort={-1} 
        />
    </div>
  )
}

export default OrderDetailPage