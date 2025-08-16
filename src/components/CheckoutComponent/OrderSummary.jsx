import React, { useEffect, useState } from 'react'
import "./CheckoutComponent.scss"
import { data, useLocation, useNavigate } from 'react-router-dom';
import VoucherSelectorComponent from "../VoucherSelectorComponent/VoucherSelectorComponent"
import *as VoucherSerice from "../../services/Voucher.Service";
import { useSelector } from 'react-redux';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { alertConfirm,alertError,alertSuccess } from '../../utils/alert';
import *as PaymentService from "../../services/Payment.Service.js";
import getDiscountPrice from '../../utils/getDiscountPrice.js';

const OrderSummary = ({cartItems,handleOrder,setOrderSummary,orderSummary,paymentMethod ,isValidForm}) => {
  const navigate=useNavigate();
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);
  const [inputVoucher,setInputVoucher]=useState(null);
  const user=useSelector((state)=>state.user)
  const [error,setError]=useState(false);
  const location=useLocation();
  const [paypalClientId, setPaypalClientId] = useState(null);

  const amount = (orderSummary.finalPrice / 24000).toFixed(2);
  const currency = "USD" ;

  const onSelectVoucher = (voucher) => {
       setSelectedVoucher(voucher);
  };



  useEffect(()=>{
    if(location?.state?.code&&location?.state?.discountValue) {
        setSelectedVoucher(location.state)
    }
  },[location.state])
  


  const onChangeInputVoucher=(e) =>{
      setInputVoucher(e.target.value);
      setError(false)
  }

  useEffect(()=>{
      setInputVoucher(null)
      setError(false)
  },[selectedVoucher])
  
  const handleApplyVocuher=async ()=>{
      const userId=user?.id;
      const access_token=user?.access_token;
      const data={
        code: inputVoucher,
        totalPrice: orderSummary.totalPrice
      }
      try {
        const res = await VoucherSerice.check(data, userId, access_token);
        if (res?.data?.iSuccess) {
          setSelectedVoucher(res.data.voucher);
          setError(false);
        }
      } catch (error) {
        setError( error.response?.data?.message);
      }
    }


  useEffect(() => {
    if (!cartItems || cartItems.length === 0) return;
    const updatedItems= cartItems?.map(item =>{
        const discountPrice=getDiscountPrice(item.price,item.product.discount);
        console.log(discountPrice)
        return {...item,price: discountPrice}
    })
    let total = updatedItems.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);
    setCartTotal(total);

    let shipping = 28000;
    if (total >= 1000000) {
      shipping = 0;
    }
    let discount = 0;
    if (selectedVoucher) {
      if (selectedVoucher.discountType === "percentage") {
        discount = total * (selectedVoucher.discountValue / 100);
        if(selectedVoucher.maxDiscountValue) {
          discount=Math.min(discount,selectedVoucher.maxDiscountValue)
        }
      } else {
        discount = selectedVoucher.discountValue;
      }
    }
    discount=Math.floor(discount)
    let finalPrice = total - discount + shipping;
    finalPrice=Math.floor(finalPrice);
    if(finalPrice<0){
      finalPrice=0;
    }
    setOrderSummary({
      totalPrice: total,
      shipping: shipping,
      discountCode: selectedVoucher?.code,
      discountValue: discount,
      finalPrice: finalPrice
    });
  }, [cartItems, setOrderSummary,selectedVoucher]);

  useEffect(()=>{
    const addPaypal=async () =>{
      try {
          const { data } = await PaymentService.getConfig();
          setPaypalClientId(data);
        } catch (err) {
          console.error("Lỗi ", err);
      }
    }
    addPaypal(); 
  },[])

  const onSuccessPayPal = (data, actions) => {
    return actions.order.capture().then((details) => {
      const updateDataPay = {
        isPaid: true,
        status: "confirmed",
        paidAt: details.update_time,
        paypalOrderId: data.orderID
      };
      handleOrder(updateDataPay)
    });
  };


  return (
    <div className="checkout_right">
          <h2>Đặt hàng</h2>
          <table className="order_summary_table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Sản phẩm</th>
                  <th style={{ textAlign: 'right',whiteSpace: 'nowrap' }}>Tổng cộng</th>
                </tr>
              </thead>
              <tbody>
                  {cartItems?.length>0&&cartItems.map((item)=>{
                      return (
                        <tr key={item.product._id} >
                          <td style={{display:'flex',alignItems:'center'}}>
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.images[0]}
                                  style={{ width: '60px', marginRight: '8px', verticalAlign: 'middle' }}
                                />
                  
                            
                                <div>
                                  <div style={{ fontWeight: 500 }}>{item.product.name}</div>
                                  <div style={{ fontSize: '14px', color: '#555' }}>
                                    {item.volume}ml - Fullbox × {item.quantity}
                                  </div>
                                </div>
                            
                            </td>

                            <td style={{ 
                              textAlign: 'right', 
                              fontWeight: 600, 
                              verticalAlign: 'middle', 
                              fontSize: '18px' 
                            }}>
                                {(getDiscountPrice(item.quantity*item.price,item.product.discount)).toLocaleString()}₫ 
                            </td>
                        </tr>
                      )
                  })}
                  
                  
                  

                  <tr>
                    <td colSpan={2}>
                       <div style={{ display: 'flex',alignItems:'center', gap: '2px',padding:'10px 0px' }}>
                        {!selectedVoucher ? (
                          <>
                            <input
                              type="text"
                              placeholder="Mã ưu đãi"
                              value={inputVoucher}
                              onChange={onChangeInputVoucher}
                              style={{height:'35px'}}
                            />
                            <VoucherSelectorComponent
                              cartTotal={cartTotal}
                              onSelect={onSelectVoucher}
                            />
                            <button  disabled={!inputVoucher||error}  onClick={handleApplyVocuher} >
                                  Áp dụng
                            </button>
                          </>
                            ) : (
                              <>
                                <div style={{ flex: 1 }}>
                                  <p>Mã ưu đãi: <b>{selectedVoucher?.code}</b></p>
                                  <p>Tiết kiệm ngay : <b>{orderSummary?.discountValue?.toLocaleString()}₫</b></p>
                                </div>
                                <button style={{width:'100px',height:'30px'}} onClick={() => setSelectedVoucher(null)}>Xóa</button> <br/>
                                <span>
                                  
                                </span>
                              </>
                            )}
                      </div>
                      {error&& (<p style={{color:'red',fontSize:'14px'}}>{error} </p>)}
                    </td>
                  </tr>

                  <tr>
                    <td><strong>Tổng cộng</strong></td>
                    <td style={{ textAlign: 'right',fontWeight: 'bold' }}>{orderSummary?.totalPrice?.toLocaleString()}₫</td>
                  </tr>

                  <tr>
                    <td><strong>Phí ship</strong></td>
                    <td style={{ textAlign: 'right',fontWeight: 'bold' }}>{orderSummary?.shipping}₫</td>
                  </tr>

                   <tr>
                    <td><strong>Giảm giá</strong></td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>-{orderSummary?.discountValue?.toLocaleString()}₫</td>
                  </tr>

                  <tr>
                    <td><strong>Tổng tiền</strong></td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{orderSummary?.finalPrice?.toLocaleString()}₫</td>
                  </tr>
            </tbody>
          </table>

          <p className="privacy_note">
            Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng theo <a href="#">privacy policy</a>.
          </p>
          {paymentMethod==='paypal' && (
          <PayPalScriptProvider 
              options={{
                "client-id": paypalClientId, 
                currency: currency,
              }}
            >
              <PayPalButtons
             
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          currency_code: currency,
                          value: amount,
                        },
                      },
                    ],
                  });
                }}
                onApprove={onSuccessPayPal}
                onError={(err) => {
                  console.log(err)
                  alertError("Có lỗi xảy ra khi thanh toán");
                }}
                disabled={!isValidForm}
              />
            </PayPalScriptProvider>
          )}
          

          {paymentMethod==='cod'&&(
          
              <div className="order_btn"  onClick={()=> handleOrder()}>Đặt hàng</div>
          )}
             
          
          <div className="cart_btn" onClick={()=> navigate('/cart')}>Quay lại giỏ hàng</div>
    </div>
  )
}

export default OrderSummary