import { Fomater } from '../../utils/fomater';
import CartTableComponent from '../../components/CartTableComponent/CartTableComponent';
import { useSelector } from 'react-redux';
import "./CartPage.scss"
import { useNavigate } from 'react-router-dom';
const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const total= useSelector((state) => state.cart.total);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const navigate=useNavigate();
  return (

    <div className='container'>
        <div className='cart_page'>

            {cartItems.length>0 ? (
               <>
                    <CartTableComponent cartItems={cartItems} />
                    <div className='cart_btn'>
                        <div class="order_summary">
                            <div class="summary_row">
                                <span>Tạm tính ({total} sản phẩm)</span>
                                <span class="price">{totalPrice.toLocaleString()}₫</span>
                            </div>

                            <div class="summary_row">
                                <span>Giảm giá</span>
                                <span class="price">-58,000₫</span>
                            </div>

                            <div class="summary_row">
                                <span>Tổng tiền</span>
                                <span class="price">{totalPrice.toLocaleString()}₫</span>
                            </div>
                        </div>

                        <div className='btn_checkout' onClick={()=> navigate('/checkout')}>
                                        Tiến hành thanh toán    
                        </div>

                        <div className='btn_home' onClick={() => navigate('/')}>
                            Tiếp tục mua hàng
                        </div>
                    </div>
               </>
        
            ): (
                <div className='btn_home'>
                        Tiếp tục mua hàng
                </div>
            )}
        </div>
    </div>

  );
};

export default CartPage;
