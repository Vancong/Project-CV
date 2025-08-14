import React, { useState } from 'react'
import *as OrderService from "../../services/Order.Service"
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Pagination } from 'antd';
import "./MyOrderComponent.scss"
import { useNavigate } from 'react-router-dom';
import { getStatusLabel } from '../../utils/orderStatus';
const MyOrderComponent = () => {
  const user=useSelector((state)=> state.user)
  const [page, setPage] = useState(1);
  const limit = 5;
  const navigate= useNavigate();
  const { isLoading , data } = useQuery({
    queryKey: ['my-order',page],
    queryFn: () => OrderService.getMyOrder(user?.id,user?.access_token,page,limit),
    keepPreviousData: true
  });
  
  const myOrder=data?.data



  return (
    <div className='my_order'>
        <h1 className='title'>Danh sách đơn hàng</h1>
           
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th >Mã đơn hàng</th>
                        <th >Tên khách hàng</th>
                        <th >Ngày đặt hàng</th>
                        <th >Trạng thái</th>
                        <th >Tổng tiền</th>
                        <th >Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {myOrder?.data?.length>0&&myOrder?.data?.map(item =>{
                        return (
                            <tr key={item.orderCode}>
                                <td>{item.orderCode}</td>
                                <td>{item.name}</td>
                                <td>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td >
                                    <span class={`status_badge ${item.status}`}>{getStatusLabel(item.status)}</span>
                                </td>
                                <td >{item.finalPrice.toLocaleString()}₫</td>
                                <td >
                                   <span className="view_detail" 
                                         onClick={()=> navigate(`/my-order/detail/${item.orderCode}`)}>  
                                         Xem chi tiết
                                   </span>
                                   
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Pagination
                current={page}
                total={myOrder?.total || 0}
                pageSize={limit}
                onChange={(page) => setPage(page)}
                style={{ marginTop: 20, textAlign: 'center' }}
            />
            
        </div>

        
    </div>
  )
}

export default MyOrderComponent