import React, { useEffect } from 'react'
import "./OrderDetailComponent.scss"
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import *as OrderService from "../../services/Order.Service"
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import LoadingComponent from "../LoadingComponent/LoadingComponent"
import { useMutationHook } from '../../hooks/useMutationHook'
import { useQueryClient } from '@tanstack/react-query';

const OrderDetailComponent = () => {
    const user=useSelector((state)=>state.user)
    const {orderCode}=useParams();
    const queryClient=useQueryClient()
    const navigate=useNavigate();
    const { isLoading , data } = useQuery ({
        queryKey: ['order-detail'],
        queryFn: () => OrderService.getDetail(user?.id,user?.access_token,orderCode),
        keepPreviousData: true,
        enabled: !!orderCode,
    });
    const orderDeatil=data?.data;
    const addres=`${orderDeatil?.address?.ward}, ${orderDeatil?.address?.district},
    ${orderDeatil?.address?.province}`;

    const mutationChangeStatus= useMutationHook(async ({id,access_token,data})=>{
        console.log(id,access_token,data)
        return await OrderService.changeStatus(id,access_token,data)
    })
    const {isPending:isPendingChangeStatus,isSuccess:isSuccessPending,data: dataChangeStatus}=mutationChangeStatus;
    
    useEffect(()=>{
        if(dataChangeStatus?.status==='OK'&&isSuccessPending){
              queryClient.invalidateQueries(['order-detail']);
        }
    },[isSuccessPending,dataChangeStatus])
    const canCancel = orderDeatil?.status === 'confirmed' || orderDeatil?.status === 'pending';
    const handleCancel= () =>{

  
            const data={
            orderCode,
            status: 'cancelled'
        }
        console.log(user?.id,user?.access_token,data)
        mutationChangeStatus.mutate({id:user?.id,access_token:user?.access_token,data});
       
    }

    const statusOrder= {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        shipping: 'Đang giao hàng',
        completed: 'Giao hàng thành công',
        cancelled: 'Đã hủy'
    }
  return (
    <LoadingComponent isPending={isLoading}>
        {orderDeatil&&(
            <div className='order_detail'>
                <h2>Đơn hàng {orderCode}</h2>

                <div className="order_info">
                    <div className="left">
                    <p><strong>Ngày đặt hàng:</strong>{new Date(orderDeatil.createdAt).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Trạng thái:</strong> <span className={`status_badge ${orderDeatil.status}`}>
                        { statusOrder[orderDeatil.status]} </span>
                    </p>
                    <p><strong>Thanh toán:</strong> <span className="payment_method">{orderDeatil.paymentMethod}</span></p>
                    </div>
                    <div className="right">
                    <p><strong>Khách hàng:</strong> {orderDeatil.name}</p>
                    <p><strong>Điện thoại:</strong> {orderDeatil.phone}</p>
                    <p><strong>Email:</strong> {orderDeatil.email || "Không có"} </p>
                    <p><strong>Địa chỉ: </strong>{addres}</p>
                    </div>
                </div>

                <table className="product_table">
                    <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Dung tích</th>
                        <th>Thành tiền</th>
                    </tr>
                    </thead>
                    <tbody>
                        {orderDeatil.items.length>0&&orderDeatil.items.map(item =>{
                                return (
                                    <tr key={item.orderCode}>   
                                        <td>
                                            <div onClick={() => navigate(`/product-details/${item.product.slug}`)}  
                                                style={{display:'flex',alignItems:'center',cursor:'pointer'}}
                                            >
                                                <img width={100} height={100} style={{marginRight:10}} 
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                />
                                                <p>{item.product.name}</p>
                                            </div>
                                        </td>                                   
                                        <td >{item.price.toLocaleString()}₫</td>
                                        <td>{item.quantity}</td> 
                                        <td >{item.volume}</td>
                                        <td > {(item.price*item.quantity).toLocaleString()}₫</td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>

                <div className="total_summary">
                    <h2>Tổng kết đơn hàng</h2>
                    <div className="row"><span>Tạm tính:</span> 
                            <span className='price'>{(orderDeatil.totalPrice).toLocaleString()}₫</span>
                    </div>
                    <div className="row"><span>Giảm giá:</span> <span className='price'>-300,000đ</span></div>
                    <div className="row" ><span>Phí vận chuyển:</span>
                            <span className='price'>{(orderDeatil.shipping).toLocaleString()}₫</span>
                    </div>
                    <div className="row total"><span>Tổng cộng:</span> 
                            <span > {(orderDeatil.finalPrice).toLocaleString()}₫</span>
                    </div>
                </div>

                <div className='btn_action'>
                   <LoadingComponent isPending={isPendingChangeStatus} >
                        <div  className={`btn cancel ${(isPendingChangeStatus || !canCancel) ? 'disabled' : ''}`}
                            onClick={() => {
                                if (canCancel) handleCancel();
                            }}
                        >
                                {isPendingChangeStatus ? 'Đang hủy...' : 'Hủy đơn hàng'}
                        </div>
                   </LoadingComponent>
                    <div className='btn contact'>
                            Liên hệ hỗ trợ
                    </div>
                </div>
            </div>
        )}
    </LoadingComponent>
  )
}

export default OrderDetailComponent