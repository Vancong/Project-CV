import { Fomater } from '../../utils/fomater';
import CartTableComponent from '../../components/CartTableComponent/CartTableComponent';
import { useSelector } from 'react-redux';
import "./CartPage.scss"
import { useNavigate } from 'react-router-dom';
import VoucherSelectorComponent from '../../components/VoucherSelectorComponent/VoucherSelectorComponent';
import { useEffect, useState } from 'react';
import *as VoucherSerice from "../../services/Voucher.Service"

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const [selectedVoucher,setSelectedVoucher]=useState(null);
  const [finalPrice,setFinalPrice]=useState(0);
  const[cartTotalPrice,setCartTotalPrice]=useState(0);
  const [error,setError]=useState(false);
  const [inputVoucher,setInputVoucher]=useState(null);
  const [discountValue,setDiscountValue]=useState(null);
  const navigate=useNavigate();
  const user=useSelector((state)=>state.user)

  const onSelect=(voucher) =>{
        setSelectedVoucher(voucher)
        setInputVoucher(null)
        setError(false)
  }

  const onChangeInputVoucher=(e)=>{
        setInputVoucher(e.target.value)
        setError(false)
  }

  useEffect(()=>{
    const totalPrice = cart.items?.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setCartTotalPrice(totalPrice);

    let discount=0;
    if(selectedVoucher) {
        if(selectedVoucher.discountType==='fixed'){
            discount=selectedVoucher.discountValue;
        }
        else {
            discount= selectedVoucher.discountValue/100*totalPrice;
             if(selectedVoucher.maxDiscountValue) {
                discount=Math.min(discount,selectedVoucher.maxDiscountValue)
            }
        }
        discount=Math.floor(discount);
         setDiscountValue(discount);
    }
    
    let finalPrice=totalPrice-discount;
    if(finalPrice<0){
        finalPrice=0;
    }
    finalPrice=Math.floor(finalPrice)
    setFinalPrice(finalPrice)


  },[selectedVoucher,cart])


    const handleApplyVocuher=async ()=>{
        console.log('ok')
        const userId=user?.id;
        const access_token=user?.access_token;
        const data={
            code: inputVoucher,
            totalPrice: cartTotalPrice
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

    const handleCheckout=() =>{
        navigate('/checkout',{
            state:{
                discountValue:discountValue,
                code: selectedVoucher?.code
            }
        })
    }

  return (

    <div className='container'>
        <div className='cart_page'>
            {cart?.items?.length>0 ? (
               <>
                    <div>
                        <CartTableComponent cartItems={cart.items} />

                         {!selectedVoucher ? (
                          <div className='voucher'>
                            <input
                              type="text"
                              placeholder="Mã ưu đãi"
                              value={inputVoucher}
                              onChange={onChangeInputVoucher}
                              style={{height:'35px'}}
                            />
                            <VoucherSelectorComponent
                              cartTotal={cartTotalPrice}
                              onSelect={onSelect}
                            />
                            <button  disabled={!inputVoucher||error}  onClick={handleApplyVocuher} >
                                  Áp dụng
                            </button>
                          </div>
                            ) : (
                              <div className='voucher'>
                                <div>
                                  <p>Mã ưu đãi: <b>{selectedVoucher?.code}</b></p>
                                  <p>Tiết kiệm ngay : <b>{discountValue?.toLocaleString()}₫</b></p>
                                   <button style={{width:'100px',height:'30px'}} onClick={() => setSelectedVoucher(null)}>Xóa</button> 
                                </div>
                              </div>
                            )}
                             {error&& (<p style={{color:'red',fontSize:'14px'}}>{error} </p>)}
                    </div>
                    <div className='cart_btn'>
                        <div class="order_summary">
                            <div class="summary_row">
                                <span>Tạm tính ({cart.total} sản phẩm)</span>
                                <span class="price">{cartTotalPrice?.toLocaleString()}₫</span>
                            </div>

                            <div class="summary_row">
                                <span>Giảm giá</span>
                                <span class="price">-{discountValue?.toLocaleString()||0}₫</span>
                            </div>

                            <div class="summary_row">
                                <span>Tổng tiền</span>
                                <span class="price">{finalPrice?.toLocaleString()}₫</span>
                            </div>
                        </div>

                        <div className='btn_checkout' onClick={handleCheckout}>
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
