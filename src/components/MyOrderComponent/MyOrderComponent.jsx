import React, { useState } from 'react'
import *as OrderService from "../../services/Order.Service"
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Pagination, Select } from 'antd';
import "./MyOrderComponent.scss"
import { useNavigate } from 'react-router-dom';
import { getStatusLabel } from '../../utils/orderStatus';
import NavigationPathComponent from '../NavigationPathComponent/NavigationPathComponent';
const MyOrderComponent = () => {
  const user=useSelector((state)=> state.user)
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const limit = 5;
  const navigate= useNavigate();
  const { isLoading , data } = useQuery({
    queryKey: ['my-order',page,status],
    queryFn: () => OrderService.getMyOrder(user?.id,user?.access_token,page,limit,status),
    keepPreviousData: true
  });
  
  const myOrder=data?.data

    const orderStatusOptions = [
        { value: "", label: "Tất cả" },          
        { value: "pending", label: "Chờ xử lý" },
        { value: "confirmed", label: "Đã xác nhận" },
        { value: "shipping", label: "Đang giao" },
        { value: "completed", label: "Giao thành công" },
        { value: "cancelled", label: "Đã hủy" },
        { value: "refund_pending", label: "Chờ hoàn tiền" },
        { value: "refunded", label: "Đã hoàn tiền" },
    ];

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1)
  };

  return (
    <div className='my_order'>

        <NavigationPathComponent category="Danh sách đơn hàng" />
        <h1 className='title'>Danh sách đơn hàng</h1>
          <Select
            style={{ width: 220 }}
            placeholder="Chọn trạng thái"
            value={status}
            onChange={handleStatusChange}
            options={orderStatusOptions}
        />
        {myOrder?.data?.length>0?(
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
        ): (<p style={{color:'red',marginTop:20}}>Không có đơn hàng nào</p>)}

        
    </div>
  )
}

export default MyOrderComponent