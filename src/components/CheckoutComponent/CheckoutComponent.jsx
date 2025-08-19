import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import * as CartService from "../../services/Cart.Service";
import './CheckoutComponent.scss';
import InputInfo from './InputInfo';
import OrderSummary from './OrderSummary';
import { useMutationHook } from '../../hooks/useMutationHook';
import * as OrderService from "../../services/Order.Service";
import { clearCart } from '../../redux/slices/CartSlice';
import { useNavigate } from 'react-router-dom';
import { alertError } from '../../utils/alert';

const CheckoutComponent = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cartState, setCartState] = useState([]);
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

  const [orderSummary, setOrderSummary] = useState({
    shipping: 0,
    totalPrice: 0,
    finalPrice: 0,
    discountCode: null,
    discountValue: 0
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [errors, setErrors] = useState({});

  const getCart = async (id, access_token) => {
    const res = await CartService.getDetail(id, access_token);
    return res.data;
  }

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => getCart(user?.id, user?.access_token),
  });

  useEffect(() => {
    if (!cartItems) return;

    let newCart = [...cartItems];

    newCart = newCart.filter(item => {
      const size = item.product.sizes.find(size => size.volume === item.volume);
      if (size.countInStock === 0) {
        alertError(`Sản phẩm ${item.product.name} (${item.volume}) đã hết hàng và bị xóa khỏi giỏ.`);
        return false; 
      }
      return true;
    });

    newCart = newCart.map(item => {
      const size = item.product.sizes.find(size => size.volume === item.volume);
      if (size && size.countInStock < item.quantity) {
        alertError(`Chỉ còn ${size.countInStock} sản phẩm ${item.product.name}`);
        return { ...item, quantity: size.countInStock };
      }
      return item;
    });

    setCartState(newCart);
  }, [cartItems]);

  const validateForm = () => {
    const { name, phone, email } = formData;
    const newErrors = {};

    if (!name) newErrors.name = "Vui lòng nhập họ tên.";
    if (!phone) newErrors.phone = "Vui lòng nhập số điện thoại.";
    else if (!/^0\d{9}$/.test(phone)) newErrors.phone = "Số điện thoại không hợp lệ.";
    if (email && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) newErrors.email = "Email không hợp lệ.";
    if (!fullAddress.province || !fullAddress.district || !fullAddress.ward) newErrors.fullAddress = "Vui lòng chọn đầy đủ tỉnh, huyện, xã.";
    console.log(newErrors)
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const mutationOrder = useMutationHook(async ({ id, access_token, data }) => {
    return await OrderService.create(id, access_token, data);
  });

  const { data: dataOrder, isSuccess: isSuccessOrder } = mutationOrder;

  useEffect(() => {
    if (dataOrder?.status === 'OK') {
      const handleClearCart = async () => {
        const access_token = user?.access_token;
        const userId = user?.id;
        navigate(`/order-success?orderCode=${dataOrder.data.orderCode}&finalPrice=${dataOrder.data.finalPrice}&isPaid=${dataOrder.data.isPaid}`);
        try {
          await CartService.clearCart(userId, access_token);
          dispatch(clearCart()); 
        } catch (err) {
          console.error("Xoá giỏ hàng thất bại:", err);
        }
      }
      handleClearCart();
    }
  }, [isSuccessOrder, dataOrder]);

  const handleOrder = (updateDataPay = null) => {
    if (!validateForm()) return;
    if (!cartState || cartState.length === 0) {
      return alertError("Giỏ hàng trống");
    }

    const orderItems = cartState.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      volume: item.volume,
      price: item.price,
    }));

    let data = {
      user: user?.id,
      ...formData,
      address: fullAddress,
      items: orderItems,
      ...orderSummary,
      paymentMethod,
      ...updateDataPay
    };

    mutationOrder.mutate({ id: user?.id, access_token: user?.access_token, data });
  };

  return (
    <div>
      <LoadingComponent isPending={isLoading}>
        <div className="checkout_page">
          <InputInfo
            formData={formData}
            setFormData={setFormData}
            fullAddress={fullAddress}
            setFullAddress={setFullAddress}
            errors={errors}
            setErrors={setErrors}
          />

          <div className="checkout_middle">
            <h2>Phương thức thanh toán</h2>
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
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                PayPal
              </label>
            </div>
          </div>

          <OrderSummary
            cartItems={cartState}
            handleOrder={handleOrder}
            setOrderSummary={setOrderSummary}
            orderSummary={orderSummary}
            paymentMethod={paymentMethod}
            validateForm={validateForm}
          />
        </div>
      </LoadingComponent>
    </div>
  );
};

export default CheckoutComponent;
