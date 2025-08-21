import { DatePicker  ,Select } from 'antd'
import React, { useEffect, useState } from 'react'
import {EditOutlined} from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import TableComponents from '../TableComponents/TableComponents'
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch'
import *as OrderSerivce from "../../services/Order.Service";
import OrderDetailModal from './OrderDetailModal'
import { getStatusLabel } from '../../utils/orderStatus'
import './AdminOrder.scss'

const AdminOrder = () => {
  const [isModalOpen,setIsModalOpen]=useState(false);
  const user=useSelector(state => state.user)
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSelected,setRowSelected]=useState('');
  const [orderDetail,setOrderDetail]=useState(null);
  const limit=8;

  const [inputSearch, setInputSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    paymentMethod: ''
  });

  const { RangePicker } = DatePicker;

  const onChangeSearch = (e) => {
    setInputSearch(e.target.value);
  };
  const onSearch = () => {
    setCurrentPage(1);
    setSearchText(inputSearch);
  };
  

    const { isLoading:isLoadingOrder , data: Orders } = useQuery({
    queryKey: ['order-all', currentPage,searchText,filters],
    queryFn: () => OrderSerivce.getAll(user?.access_token ,currentPage, limit,searchText,filters ),
    keepPreviousData: true
  });

  const dataTable= (Orders?.data||[]).map(order => ({...order,key:order._id,}))
  
  


  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      render: text => <a>{text}</a>,
      sorter: (a,b) => a.name.length - b.name.length
    },
     {
      title: 'Tên khách hàng',
      dataIndex: "name",
      render: text => <a>{text}</a>,
      sorter: (a,b) => a.name.length - b.name.length
    },
    {
      title: 'Số điện thoại',
      dataIndex: "phone",
      render: text => <a>{text}</a>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: "finalPrice",
      render: text => <a>{text.toLocaleString()}đ</a>,
       sorter: (a,b) => a.finalPrice - b.finalPrice
    },
     {
      title: 'Trạng thái',
      align: 'center',
      dataIndex: "status",
      render: text => <a className={`status_badge ${text}`}>{getStatusLabel(text)}</a>,
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'updatedBy',
      render: text => <span>{text || '—'}</span>,
    },
     {
      title: 'Hành động',
      align: 'center',
      dataIndex: 'action',
      render:  (_, record) => renderAcion(_, record)  
    },
  
  ];

 const handleDetailOrder=(record) =>{
    setIsModalOpen(true);
    setOrderDetail(record);
 }

  const onChangeStatus = (value) => {
    setFilters(prev => ({ ...prev, status: value || '' }));
    setCurrentPage(1);
  };

  const onChangeDateRange = (dates) => {
    setFilters(prev => ({
      ...prev,
      startDate: dates?.[0]?.format("YYYY-MM-DD") || '',
      endDate: dates?.[1]?.format("YYYY-MM-DD") || ''
    }));
    setCurrentPage(1);
  };

  const onChangePayment=(value) => {
    setFilters(pre => ({
      ...pre,
      paymentMethod: value
    }))
    setCurrentPage(1);
  }



  const renderAcion= (_,record) =>{
    return(
      <div style={{fontSize:'20px',cursor:'pointer'}} onClick={()=> { handleDetailOrder(record)}}>
        <EditOutlined  style={{color:'orange',marginRight:'10px'}}                          
        />
        Xem chi tiết đơn hàng
      </div>
    )
  }

  



  return (
    <div className='admin_order'>
      <h1 className='title'>Quản lý đơn hàng</h1>

      <div  style={{ display: 'flex', gap: 25, marginBottom: 26 }}>
        <ButtonInputSearch 
          size="middle" 
          placeholder="Nhập mã đơn hàng hoặc tên, số điện thoại..." 
          textButton="Tìm" 
          bgrColorInput="#fff"
          bgrColorButton="#1890ff"
          textColorButton="#fff"
          onChangeSearch={onChangeSearch}    
          onClickSearch={onSearch}            
          value={inputSearch}      
        />

        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: 200 }}
          allowClear
          value={filters.status || undefined}
          onChange={onChangeStatus}
          options={[
                { value: 'pending', label: 'Chờ xác nhận' },
                { value: 'confirmed', label: 'Đã xác nhận' },
                { value: 'shipping', label: 'Đang giao' },
                { value: 'completed', label: 'Giao hàng thành công' },
                { value: 'cancelled', label: 'Đã hủy' },
                { value: 'refund_pending', label: 'Đang hoàn tiền' },
                { value: 'refunded', label: 'Đã hoàn tiền' },
              ]}
         />

         <RangePicker
            style={{ width: 260 }}
            onChange={onChangeDateRange}
         />

        <Select
          placeholder="Phương thức thanh toán"
          style={{ width: 200 }}
          allowClear
          value={filters.paymentMethod || undefined}
          onChange={onChangePayment}
          options={[
            { value: 'cod', label: 'Thanh toán khi nhận hàng' },
            { value: 'paypal', label: 'PayPal' },
          ]}
        />

      </div>

        <OrderDetailModal 
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            orderDetail={orderDetail}
        />
      

      <TableComponents type='adminOrder' data={dataTable} columns={columns}
            pagination={{
            current: currentPage,
            pageSize: limit,
            total:Orders?.total || 1,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
            isLoading={isLoadingOrder} 
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => setRowSelected(record._id),   
            }}}
      />
    </div>
  )
}

export default AdminOrder