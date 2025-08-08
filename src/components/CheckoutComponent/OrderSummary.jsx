import React, { useEffect } from 'react'
import "./CheckoutComponent.scss"
import { useNavigate } from 'react-router-dom';
const OrderSummary = ({cartItems,handleOrder,setOrderSummary,orderSummary}) => {
  const navigate=useNavigate();
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) return;

    let total = cartItems.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);

    let shipping = 28000;
    if (total >= 1000000) {
      shipping = 0;
    }

    setOrderSummary({
      totalPrice: total,
      shipping: shipping,
      finalPrice: total+shipping
    });
  }, [cartItems, setOrderSummary]);

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
                                {(item.quantity*item.price).toLocaleString()}₫ 
                            </td>
                        </tr>
                      )
                  })}
                  
                
                  <tr>
                    <td colSpan={2}>
                      <div style={{ display: 'flex', gap: '8px'}}>
                        <input type="text" placeholder="Mã ưu đãi" style={{ flex: 1 }} />
                        <button>Áp dụng</button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td><strong>Tổng cộng</strong></td>
                    <td style={{ textAlign: 'right' }}>{orderSummary?.totalPrice.toLocaleString()}₫</td>
                  </tr>

                  <tr>
                    <td>Phí ship</td>
                    <td style={{ textAlign: 'right' }}>{orderSummary?.shipping}₫</td>
                  </tr>

                  <tr>
                    <td><strong>Tổng tiền</strong></td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{orderSummary?.finalPrice.toLocaleString()}₫</td>
                  </tr>
            </tbody>
          </table>

          <p className="privacy_note">
            Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng theo <a href="#">privacy policy</a>.
          </p>
          <div className="order_btn"  onClick={handleOrder}>Đặt hàng</div>
          <div className="cart_btn" onClick={()=> navigate('/cart')}>Quay lại giỏ hàng</div>
    </div>
  )
}

export default OrderSummary