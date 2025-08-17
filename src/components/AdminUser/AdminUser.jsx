import React, { useEffect, useState } from 'react';
import "./AdminUser.scss"
import { Button,Form,Modal,Tag } from 'antd';
import { PlusOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons';
import TableComponents from '../TableComponents/TableComponents';
import UserFormComponent from "../FormAdmin/UserFormComponent/UserFormComponent"
import * as UserService from "../../services/User.Service" 
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useMutationHook } from '../../hooks/useMutationHook';
import { alertConfirm, alertError, alertSuccess } from '../../utils/alert';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';


const AdminUser = () => {
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [rowSelected,setRowSelected]=useState('');
  const [isOpenDrawer,setIsOpenDrawer]=useState(false);
  const [formCreate]=Form.useForm();
  const [formUpdate]=Form.useForm();
  const queryClient=useQueryClient();
  const user=useSelector(state => state.user);

  const [currentPage, setCurrentPage] = useState(1);
  const limit=8;
  const [inputSearch, setInputSearch] = useState('');
  const [searchText, setSearchText] = useState('');

  const onChangeSearch = (e) => {
    setInputSearch(e.target.value);
  };

  const onSearch = () => {
    setCurrentPage(1);
    setSearchText(inputSearch);
  };

  const columns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      render: text => <a>{text}</a>,
      sorter: (a,b) => a.name.length - b.name.length
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Quyền Admin',
      dataIndex: "isAdmin",
      render: (isAdmin) => (
        <Tag >
          {isAdmin ? 'Có' : 'Không'}
        </Tag>
      )
    },
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

  const deleteUserMutation=useMutationHook(async({id,access_token}) =>{
    return UserService.deleteUser(id,access_token);
  })
  const handleDeleteUser= ( async(record)=>{
    const confirm = await alertConfirm('Xác nhận xoá', `Bạn có chắc muốn xoá người dùng "${record.name}"?`);
      if (!confirm) return;
      deleteUserMutation.mutate({ id: record._id, access_token: user?.access_token });
  })
  const {isSuccess: isSuccessDelete,isError: isErrorDelete,
    data: dataDelete,error: errorDelete}= deleteUserMutation;

  useEffect(()=>{
     if (isSuccessDelete && dataDelete?.status === 'OK') {
          alertSuccess('Thành công', 'Xoá sản phẩm thành công!');
          queryClient.invalidateQueries(['users']); 
        }
      if (isErrorDelete) {
        alertError('Thất bại', dataDelete?.message || 'Đã có lỗi xảy ra khi xoá.');
      }
  },[isErrorDelete,isSuccessDelete,dataDelete])

  
  const mutationDeleteManyUser = useMutationHook(async ({ ids, access_token }) => {
      return await  UserService.deleteManyUser( ids, access_token )
    });
  
    const handleDeleteManyUser= async (ids) =>{
      const confirm = await alertConfirm('Xác nhận xoá', `Bạn có chắc muốn xoá người dùng "?`);
      if (!confirm) return;
      mutationDeleteManyUser.mutate({ids, access_token: user?.access_token})
    }
    
    const{data:dataDeleteMany, isPending: isPendingDeleteMany
      ,isSuccess: isSuccessDeleteMany,isError:isErrorDeleteMany}=mutationDeleteManyUser;
    useEffect(() => {
      if (isSuccessDeleteMany && dataDeleteMany?.status === 'OK') {
        alertSuccess('Thành công', 'Xoá người dùng thành công!');
        queryClient.invalidateQueries(['users']); 
      }
      if (isErrorDeleteMany) {
        alertError('Thất bại', dataDeleteMany?.message || 'Đã có lỗi xảy ra khi xoá.');
      }
    }, [isSuccessDeleteMany, isErrorDeleteMany]);
  
  

  const handleDetailUser=( async(record) =>{
    setRowSelected(record?._id);
    
     try {
         const res = await UserService.getDetailUser(record?._id,user?.access_token);
         if(res?.data){
           const user = res.data;
           formUpdate.setFieldsValue({
             name: user.name,
             email: user.email,
             password:"",
             isAdmin: user.isAdmin ,
             isActive: user.isActive ,
           });
           setIsOpenDrawer(true);
         }
       } catch (error) {
         alertError('Lỗi', 'Không thể tải chi tiết người dùng');
       }
  })
  const renderAcion= (_,record) =>{
    return(
      <div style={{fontSize:'20px'}}>
        <EditOutlined  style={{color:'orange',cursor:'pointer',marginRight:'10px'}}
                         onClick={()=> { handleDetailUser(record)}}
        />
        <DeleteOutlined style={{color:'red',cursor:'pointer'}} 
                        onClick={ () => handleDeleteUser(record)}  
        />
      </div>
    )
  }
  const onCancel=(() =>{
    setIsModalOpen(false);
    formCreate.resetFields();
  })

  const mutationCreate= useMutationHook(async(data) =>{
      return await UserService.signUpUser(data);
  })

  const {data: dataCreate,isError: isErrorCreate,error:ErrorCreate,
    isPending :isPendingCreate ,isSuccess: isSuccessCreate}
  =mutationCreate;
  useEffect(()=>{
    if(isSuccessCreate&&dataCreate?.status==='OK') {
      alertSuccess("Thành Công","Thêm người dùng thành công")
      queryClient.invalidateQueries(['users']);
      setIsModalOpen(false);
      formCreate.resetFields();
    }
    else if(isErrorCreate) {
       alertError("Thất bại",ErrorCreate?.message)
    }
  },[isErrorCreate,isSuccessCreate,dataCreate])

  const onCreateUser =((values) =>{
     mutationCreate.mutate({
        email: values.email,
        password: values.password,
        confirmPassword: values.password
    });

  })
  const mutationUpdate = useMutationHook(async (data) => {
      return await UserService.updateUser(data.id, data.dataUpdate,data.access_token);
       
  });
   const {data: dataUpdate,isError: isErrorUpdate,error :errorUpdate,
    isPending :isPendingUpdate ,isSuccess: isSuccessUpdate}
  =mutationUpdate;

  useEffect(() => {
    if (isSuccessUpdate && dataUpdate?.status === 'OK') {
      alertSuccess("Thành Công", "Cập nhật người dùng thành công");
      queryClient.invalidateQueries(['users']);
      setIsOpenDrawer(false); 
    } else if (isErrorUpdate) {
      alertError("Thất bại", errorUpdate?.message);
    }
  }, [dataUpdate, isErrorUpdate, isSuccessUpdate]);


  const onUpdataUser= ( (values) =>{
    const dataUpdate={

      name: values.name,
      email: values.email,
      isAdmin: values.isAdmin,
      isActive: values.isActive,
    }

    if (values.password && values.password.trim() !== '') {
        dataUpdate.password = values.password;
    }

     mutationUpdate.mutate({
      id: rowSelected,
      dataUpdate,
      access_token:user?.access_token
    });
  })

  const { isLoading:isLoadingUsers , data: users } = useQuery({
      queryKey: ['users',currentPage,searchText],
      queryFn: () => UserService.getAlllUser(currentPage,limit,searchText,user.access_token),
      keepPreviousData: true,
      enabled: !!user.access_token
  });

  const dataTable= (users?.data|| []).map(user => ({...user,key: user._id}))
  
return (
    <div className='admin_user'>
      <h1 className='title'>Quản lý người dùng</h1>
      <Button  className='btn_add' onClick={() => setIsModalOpen(true)}>
          <PlusOutlined /> Thêm người dùng
      </Button>

      <ButtonInputSearch 
        size="middle" 
        placeholder="Nhập email hoặc tên người dùng.." 
        textButton="Tìm" 
        bgrColorInput="#fff"
        bgrColorButton="#1890ff"
        textColorButton="#fff"
        onChangeSearch={onChangeSearch}    
        onClickSearch={onSearch}            
        value={inputSearch}      
      />

      <div style={{marginTop: '25px'}}>
        <Modal 
          title="Thêm người dùng"
          footer={null}
          open={isModalOpen}
          onCancel={onCancel}
        >
          <UserFormComponent
            form={formCreate}
            onFinish={onCreateUser}
            isLoading={isPendingCreate}
          />
        </Modal>
        <LoadingComponent isPending={isPendingUpdate} >
          <DrawerComponent  title='Chi tiết người dùng' isOpen={isOpenDrawer} 
                          onClose={()=> setIsOpenDrawer(false)}
                          width="83.5%" >
            <UserFormComponent
              form={formUpdate}
              onFinish={onUpdataUser}
              isLoading={isPendingUpdate}
              mode='update'
            />
          </DrawerComponent>
        </LoadingComponent>
        <TableComponents data={dataTable} columns={columns}
            handleDeleteMany={handleDeleteManyUser}
            pagination={{
              current: currentPage,
              pageSize: limit,
              total: users?.total||1,
              onChange: (page) => setCurrentPage(page),
              showSizeChanger: false,
            }}
            isLoading={isLoadingUsers} 
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => setRowSelected(record._id),
            
            }}}
        />
      </div>
    </div>
  );
};

export default AdminUser;