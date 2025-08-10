import React, { useEffect, useState } from 'react'
import VoucherFormComponent from '../FormAdmin/VoucherFormComponent/VoucherFormComponent'
import { PlusOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons';
import { Modal,Form, Tag } from 'antd';
import { Button } from 'antd/es/radio';
import { useMutationHook } from "../../hooks/useMutationHook";
import *as VoucherService from "../../services/Voucher.Service"
import { useSelector } from 'react-redux';
import {alertConfirm,alertError,alertSuccess} from "../../utils/alert"
import { isPending } from '@reduxjs/toolkit';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TableComponents from '../TableComponents/TableComponents';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import moment from 'moment'
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
const AdminVoucher = () => {
  const [isModalOpen,setIsModalOpen]=useState(false);
  const user=useSelector((state)=> state.user)
  const [rowSelected,setRowSelected]=useState(null)
  const [isOpenDrawer,setIsOpenDrawer]=useState(false);
  const queryClient=useQueryClient();
  const [formCreate]=Form.useForm() ;
  const [formUpdate]=Form.useForm();

  const [inputSearch, setInputSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const limit=8;
  
  const onChangeSearch = (e) => {
    setInputSearch(e.target.value);
  };
  const onSearch = () => {
    setCurrentPage(1);
    setSearchText(inputSearch);
  };

  const onCancel=()=>{
    setIsModalOpen(false);
    formCreate.resetFields();
  }

  const mutationCreate=useMutationHook(async ({data,access_token})=>{
    return await VoucherService.create(data,access_token);
  })
  const {isPending: isPendingCreate,data: dataCreate,
        error: errorCreate,isSuccess: isSuccessCraete,isErrorCreate
  }=mutationCreate

  
  const mutationUpdate=useMutationHook(async({id,data,access_token})=>{
     return await VoucherService.update(id,data,access_token)
  })

  const {isPending: isPendingUpdate,data: dataUpdate,isError: isErrorUpdate,
        isSuccess: isSuccessUpdate,error: errorUpdate
  }=mutationUpdate;



  const handleDeleteVoucher= async(record)=>{
      const confirm = await alertConfirm('Xác nhận xoá', `Bạn có chắc muốn xoá sản mã giảm giá
         "${record.code}"?`);
      if (!confirm) return;
      
      mutationDelete.mutate({ id: record._id, access_token: user?.access_token });
  }

    
  const mutationDelete=useMutationHook(async({id,access_token})=>{
     return await VoucherService.deleteVoucher(id,access_token)
  })

  
  const {isPending: isPendingDelete,data: dataDelete,isError: isErrorDelete,
        isSuccess: isSuccessDelete,error: errorDelete
  }=mutationDelete;


  
  const handleDeleteMany= async(ids) =>{
    const confirm = await alertConfirm('Xác nhận xoá', `Bạn có chắc muốn xoá sản mã giảm giá`);
    if (!confirm) return;

    mutationDeleteMany.mutate({ ids: ids, access_token: user?.access_token });
  }
  const mutationDeleteMany=useMutationHook(async({ids,access_token})=>{
     return await VoucherService.deleteMany(ids,access_token)
  })

  
  const {isPending: isPendingDeleteMany,data: dataDeleteMany,isError: isErrorDeleteMany,
        isSuccess: isSuccessDeleteMany,error: errorDeleteMany
  }=mutationDeleteMany;

  useEffect(() => {
    if (dataCreate?.status === 'OK' && isSuccessCraete) {
      alertSuccess("Thêm mã giảm giá thành công");
      queryClient.invalidateQueries(['voucher']);
      onCancel();
    } else if (isErrorCreate) {
      alertError("Thất bại", errorCreate?.message);
    }
  }, [isSuccessCraete, isErrorCreate]);

  useEffect(() => {
    if (dataUpdate?.status === 'OK' && isSuccessUpdate) {
      alertSuccess("Cập nhật giảm giá thành công");
      queryClient.invalidateQueries(['voucher']);
      setIsOpenDrawer(false);
    } else if (isErrorUpdate) {
      alertError("Thất bại", errorUpdate?.message);
    }
  }, [isSuccessUpdate, isErrorUpdate]);

  useEffect(() => {
    if (dataDelete?.status === 'OK' && isSuccessDelete) {
      alertSuccess("Xóa mã giảm giá thành công");
      queryClient.invalidateQueries(['voucher']);
    } else if (isErrorDelete) {
      alertError("Thất bại", errorDelete?.message); 
    }
  }, [isSuccessDelete, isErrorDelete]);

  useEffect(() => {
    if (dataDeleteMany?.status === 'OK' && isSuccessDeleteMany) {
      alertSuccess("Xóa mã giảm giá thành công");
      queryClient.invalidateQueries(['voucher']);
    } else if (isErrorDeleteMany) {
      alertError("Thất bại", errorDeleteMany?.message);
    }
 }, [isSuccessDeleteMany, isErrorDeleteMany]);

  const onFinish=(values,type) =>{
    const data = {
        code: values.code,
        discountType: values.discountType,
        discountValue: values.discountValue,
        minOrderValue: values.minOrderValue||0,
        usageLimit: values.usageLimit||0,
        usageCount: values.usageCount,
        userLimit: values.userLimit||0,
        startDate: values.startDate.format('YYYY-MM-DD'),  
        endDate: values.endDate.format('YYYY-MM-DD'),
      
    }; 

    if(data.discountType==='percentage'){
        data.maxDiscountValue=values.maxDiscountValue;
      }
    if(type==='create'){
      mutationCreate.mutate({data,access_token: user?.access_token})
    }
    else {
        data.isActive=values.isActive
      mutationUpdate.mutate({id:rowSelected,data,access_token:user?.access_token})
    }
    
  }
  

  const handleDetailVoucher= (record) =>{
    setRowSelected(record._id);
     formUpdate.setFieldsValue({
        code: record.code,
        discountType: record.discountType,
        discountValue: record.discountValue,
        startDate: moment(record.startDate),
        endDate: moment(record.endDate),
        usageLimit: record.usageLimit,
        usageCount: record.usageCount,
        userLimit: record.userLimit,
        minOrderValue: record.minOrderValue,
        isActive: record.isActive,
        maxDiscountValue: record.maxDiscountValue||null,
    })
      setIsOpenDrawer(true)
    
  }

  

    const columns = [
    {
      title: 'Mã giảm giá',
      dataIndex: 'code',
      render: text => <a>{text}</a>,
      sorter: (a,b) => a.code.length - b.code.length
    },
    {
      title: 'Giá trị giảm',
      dataIndex: 'discountValue', 
      render: (text, record) => {
        if (record.discountType === 'percentage') {
          return `${text}%`;
        } else  {
          return text.toLocaleString('vi-VN') + '₫';
        }
      },

    },

     {
      title: 'Giá đơn hàng được dùng', 
      dataIndex: 'minOrderValue',
       render: (text) => {
          return text.toLocaleString('vi-VN') + '₫';
      },
      sorter: (a,b) => a.minOrderValue - b.minOrderValue
    },
    {
        title: 'Ngày bắt đầu',
        dataIndex: 'startDate',
        render: (date) => {
            const dt = new Date(date);
            return dt.toLocaleDateString('vi-VN');
        },
        sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
     {
        title: 'Ngày kết thúc',
        dataIndex: 'endDate',
        render: (date) => {
            const dt = new Date(date);
            return dt.toLocaleDateString('vi-VN');
        },
        sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
    },
    // {
    //   title: 'Tổng số lượng mã',
    //   dataIndex: 'usageLimit', 
    //   render: text => <a>{text}</a>,
    //   sorter: (a,b) => a.usageLimit - b.usageLimit
    // },
    // {
    //   title: 'Số lượng mã đã dùng',
    //   dataIndex: 'usageCount', 
    //   render: text => <a>{text}</a>,
    //   sorter: (a,b) => a.usageCount - b.usageLimit
    // },
    {
      title: 'Trạng thái',
      dataIndex: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'volcano'}>
          {isActive ? 'Hoạt động' : 'Dừng họa động'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render:  (_, record) => renderAcion(_, record)  
    },
    
  ];

   const renderAcion= (_,record) =>{
      return(
        <div style={{fontSize:'20px'}}>
          <EditOutlined  style={{color:'orange',cursor:'pointer',marginRight:'10px'}}
                           onClick={()=> { handleDetailVoucher(record)}}
          />
          <DeleteOutlined style={{color:'red',cursor:'pointer'}} 
                          onClick={ () => handleDeleteVoucher(record)}  
          />
        </div>
      )
    }


    const {isLoading:isLoadingData,data: dateVouchers}=useQuery({
        queryKey: ['voucher',currentPage,searchText],
        queryFn: ()=> VoucherService.getAll({page:currentPage,limit,search:searchText,access_token: user?.access_token}),
        keepPreviousData: true
    })
    const dataTable=dateVouchers?.data?.length>0&&
                    dateVouchers?.data?.map(voucher =>( {...voucher,key:voucher._id}))||[];

  return (
    <div className='admin_voucher'>
        <h1 className='title'>Quản lý mã giảm giá</h1>
        <Button className='btn_add' onClick={() => setIsModalOpen(true)}>
            <PlusOutlined /> Thêm mã giảm giá
        </Button>

        
        <ButtonInputSearch 
          size="middle" 
          placeholder="Tìm kiếm mùi hương..." 
          textButton="Tìm" 
          bgrColorInput="#fff"
          bgrColorButton="#1890ff"
          textColorButton="#fff"
          onChangeSearch={onChangeSearch}    
          onClickSearch={onSearch}            
          value={inputSearch}      
        />
        <Modal 
            title="Thêm mã giảm giá"
            footer={null}
            open={isModalOpen}
            onCancel={onCancel}
        >
            <VoucherFormComponent isLoading={isPendingCreate} 
                                  form={formCreate}
                                  onFinish={(values) => onFinish(values, 'create')}
                                  
            />
        </Modal>

        <DrawerComponent  title='Chi tiết thương hiệu' isOpen={isOpenDrawer} 
                         onClose={()=> setIsOpenDrawer(false)}
                         width="83.5%" >
            <VoucherFormComponent 
                form={formUpdate}
                onFinish={(values) => onFinish(values, 'update')}
                isLoading={isPendingUpdate}
                mode='update'
            />
        </DrawerComponent>

        <TableComponents data={dataTable} columns={columns}
            pagination={{
            current: currentPage,
            pageSize: limit,
            total:dateVouchers?.total || 1,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
            handleDeleteMany={handleDeleteMany}
            isLoading={isLoadingData} 
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => setRowSelected(record._id),   
            }}}

        />
    </div>
  )
}

export default AdminVoucher