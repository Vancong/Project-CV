import React from 'react';
import './OrderSuccessPage.scss'
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
   const orderCode = queryParams.get('orderCode');
   const finalPrice = queryParams.get('finalPrice');
   const isPaid = queryParams.get('isPaid');
   console.log(isPaid)
   const navigate=useNavigate();
  return (
    <div className='container'>
        <div className="success_page">
          <div className='success_header'>
              <svg class="w-20 h-20 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h2 className='title'>ĐẶT HÀNG THÀNH CÔNG!</h2>
                {isPaid==='true'&&(
                  <h3 className='final_price'>Bạn đã thanh toán 
                     <strong style={{color:'#333'}}> {(Number(finalPrice)).toLocaleString()}đ</strong>
                </h3>
                )}
                <p className='desc'>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
          </div>

          <div className='success_btn'>
                <div className='btn_shopping' onClick={()=> navigate('/')}>
                    Tiếp tục mua sắm
                </div>

                <div className='btn_detailOrder'onClick={()=> navigate(`/my-order/detail/${orderCode}`)}>
                    Xem đơn hàng
                </div>
          </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

