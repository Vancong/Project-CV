import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import *as CartService from "../../services/Cart.Service"
import './CheckoutComponent.scss';
import InputInfo from './InputInfo';
import OrderSummary from './OrderSummary';
import { useMutationHook } from '../../hooks/useMutationHook';
import *as OrderService from "../../services/Order.Service";
import { clearCart } from '../../redux/slices/CartSlice';

const CheckoutComponent = () => {
    const user=useSelector((state)=>state.user);
    const dispatch=useDispatch();
    const [fullAddress, setFullAddress] = useState({
        province: null,
        district: null,
        ward: null,
        detail: null
    });
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        note: ''
    });

    const [orderSummary,setOrderSummary]=useState({
        shipping:0,
        totalPrice:0,
        finalPrice:0
    })

    const [paymentMethod, setPaymentMethod] = useState("cod");

    const [errors, setErrors] = useState({});


    const getCart= async (id,access_token) =>{
        const res= await CartService.getDetail(id,access_token);
        return res.data;
    }

    const { data: cartItems, isLoading, isError } = useQuery({
        queryKey: ['cart'],
        queryFn: ()=> getCart(user?.id,user?.access_token) ,
    });
  

    const validateForm = () => {
        const { name, phone, email } = formData;

        const newErrors = {};

        if (!name) newErrors.name = "Vui lòng nhập họ tên.";

        if (!phone) {
        newErrors.phone = "Vui lòng nhập số điện thoại.";
        } 
        else if (!/^0\d{9}$/.test(phone)) {
        newErrors.phone = "Số điện thoại không hợp lệ.";
        }

        if(email && ! (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ){
            newErrors.email = "Email không hợp lệ.";
        }
        
        if (!fullAddress.province || !fullAddress.district || !fullAddress.ward) {
        newErrors.fullAddress = "Vui lòng chọn đầy đủ tỉnh, huyện, xã.";
        }
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
        
    };

    const muatationOrder = useMutationHook(async ({id, access_token ,data}) => {
        return await  OrderService.create( id, access_token,data )
    });

    const {isLoading: isLoadingOrder ,isError: isErrorOrder ,
          isSuccess: isSuccessOrder,data:dataOrder}=muatationOrder;

    useEffect( () =>{
        console.log(isSuccessOrder)
        const handleClearCart = async () => {
        if (isSuccessOrder) {
            const access_token = user?.access_token;
            const userId = user?.id;
        try {
            await CartService.clearCart(userId, access_token);
            dispatch(clearCart()); 
        } catch (err) {
            console.error("Xoá giỏ hàng thất bại:", err);
        }
        }}

        handleClearCart();

    },[isSuccessOrder])
    

    const handleOrder = () => {
        if (!validateForm()) return;
        
        const orderItems = cartItems?.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            volume: item.volume,
            price: item.price
        }));


        const data= {
            user: user?.id,
            ...formData,
            address:{
                province :fullAddress.province,
                district: fullAddress.district,
                ward : fullAddress.ward,
                detail: fullAddress.detail
            },
            items:orderItems,
            ...orderSummary,
            paymentMethod:paymentMethod
        }
        muatationOrder.mutate({id:user?.id,access_token: user?.access_token,data})

        console.log("Đặt hàng với:", {
            data
        });
    };


  return (
    <div>
      <LoadingComponent isPending={isLoading} >
        <div className="checkout_page">

            <InputInfo formData={formData} setFormData={setFormData} fullAddress={fullAddress} 
                        setFullAddress={setFullAddress}  errors={errors } setErrors={setErrors}
            />
 

        <div className="checkout_middle">
          <h2>Phương thức thanh toán </h2>
             <div className="payment_methods">
                    <label>
                        <input
                            type="radio"
                            value="cod"
                            checked={paymentMethod === "cod"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                                Thanh toán khi nhận hàng (COD)
                    </label>

                    <label>
                        <input
                            type="radio"
                            value="bank_transfer"
                            checked={paymentMethod === "bank_transfer"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                                Chuyển khoản ngân hàng
                    </label>

                    <label>
                        <input
                            type="radio"
                            value="momo"
                            checked={paymentMethod === "momo"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        Ví MoMo
                    </label>

                    <label>
                        <input
                            type="radio"
                            value="zalopay"
                            checked={paymentMethod === "zalopay"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                            ZaloPay
                    </label>
                </div>

        </div>

        <OrderSummary cartItems={cartItems} handleOrder={handleOrder} 
                      setOrderSummary={setOrderSummary}
                      orderSummary={orderSummary}
        />
        </div>
      </LoadingComponent>
    </div>
  )
}

export default CheckoutComponent