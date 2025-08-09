import { Button, Modal,Form, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import {PlusOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons';
import BrandFormComponent from  "../FormAdmin/BrandFormComponent/BrandFormComponent"
import { useMutationHook } from '../../hooks/useMutationHook';
import * as BrandService from "../../services/Brand.Service"
import { alertSuccess,alertConfirm,alertError } from '../../utils/alert';
import { useSelector } from 'react-redux';
import TableComponents from '../TableComponents/TableComponents';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';


const AdminBrand = () => {
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [fileListCreate, setFileListCreate] = useState([]);
  const [fileListUpdate, setFileListUpdate] = useState([]);
  const [rowSelected,setRowSelected]=useState('');
  const [isOpenDrawer,setIsOpenDrawer]=useState(false);
  const queryClient = useQueryClient();

  const [formCreate]= Form.useForm();
  const [formUpdate] = Form.useForm();
  const user= useSelector(state =>state.user);

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


  const { isLoading:isLoadingBrands , data: Brands } = useQuery({
    queryKey: ['brands', currentPage,searchText],
    queryFn: () => BrandService.getAllBrand(currentPage, limit,searchText ,true),
    keepPreviousData: true
  });

  const dataTable= (Brands?.data||[]).map(brand => ({...brand,key:brand._id}))


  const columns = [
    {
      title: 'Tên thương hiệu',
      dataIndex: 'name',
      render: text => <a>{text}</a>,
      sorter: (a,b) => a.name.length - b.name.length
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'logo',
      render: (logo) => {
        return (
          <img src={logo} 
          alt="thumbnail" 
          style={{ width: '120px', height: '70px', objectFit: 'cover' }} 
          />
        )
    }},
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

  const handleDetailBrand= async(record) =>{
    setRowSelected(record?._id);
        try {
          const res = await BrandService.getDetailBrand(record?._id);
          console.log(res?.data)
          if(res?.data){
            const brand = res.data;
            formUpdate.setFieldsValue({
              name: brand.name,
              description: brand.description,
              isActive: brand.isActive,
              logo: brand.logo
            })

            
            const url=brand.logo;
            const imgLogo={  uid: url,
              name: url.substring(url.lastIndexOf('/') + 1),
              status: 'OK',
              url,
            }
              setFileListUpdate([imgLogo]);
            }    
           setIsOpenDrawer(true);
        } catch (error) {
          alertError('Lỗi', 'Không thể tải chi tiết thương hiệu');
        }
  }
  const handleDeleteBrand=async (record) =>{
    const confirm =  await alertConfirm('Xác nhận xoá', `Bạn có chắc muốn xoá sản phẩm "${record.name}"?`);
        if (!confirm) return;
    
    deleteBrandMutation.mutate({ id: record._id, access_token: user?.access_token });
  }
  const deleteBrandMutation = useMutationHook(async ({ id, access_token }) => {
      return await  BrandService.deleteBrand(id, access_token )
  });

   const{data:dataDelete, isPending: isPendingDelete,isSuccess: isSuccessDelete,
    isError:isErrorDelete}=deleteBrandMutation;
    useEffect(() => {
      if (isSuccessDelete && dataDelete?.status === 'OK') {
        alertSuccess('Thành công', 'Xoá thương hiệu thành công!');
        queryClient.invalidateQueries(['brands']); 
      }
      if (isErrorDelete) {
        alertError('Thất bại', dataDelete?.message || 'Đã có lỗi xảy ra khi xoá.');
      }
    }, [isSuccessDelete, isErrorDelete]);
  
    const mutationDeleteManyBrand = useMutationHook(async ({ ids, access_token }) => {
      return await  BrandService.deleteManyBrand( ids, access_token )
    });
  
    const handleDeleteManyBrand= async (ids) =>{
      const confirm = await alertConfirm('Xác nhận xoá', `Bạn có chắc muốn xoá thương ?`);
      if (!confirm) return;
      mutationDeleteManyBrand.mutate({ids, access_token: user?.access_token})
    }

    
    const{data:dataDeleteMany, isPending: isPendingDeleteMany
        ,isSuccess: isSuccessDeleteMany,isError:isErrorDeleteMany}=mutationDeleteManyBrand;
      useEffect(() => {
        if (isSuccessDeleteMany && dataDeleteMany?.status === 'OK') {
          alertSuccess('Thành công', 'Xoá thương hiệu thành công!');
          queryClient.invalidateQueries(['brands']); 
        }
        if (isErrorDeleteMany) {
          alertError('Thất bại', dataDeleteMany?.message || 'Đã có lỗi xảy ra khi xoá.');
        }
      }, [isSuccessDeleteMany, isErrorDeleteMany]);
    

  const renderAcion= (_,record) =>{
    return(
      <div style={{fontSize:'20px'}}>
        <EditOutlined  style={{color:'orange',cursor:'pointer',marginRight:'10px'}}
                         onClick={()=> { handleDetailBrand(record)}}
        />
        <DeleteOutlined style={{color:'red',cursor:'pointer'}} 
                        onClick={ () => handleDeleteBrand(record)}  
        />
      </div>
    )
  }

  const onCancel= () =>{
    setIsModalOpen(false);
    formCreate.resetFields();
    setFileListCreate([]);  
  }

  const mutationUpdate= useMutationHook (async ({id,data,access_token})=>{
      return await BrandService.updateBrand(id,data,access_token)
  })

  const {isSuccess: isSuccessUpdate, isError: isErrorUpdate,
    isPending:isPendingUpdate,error:errorUpdate,data:dataUpdate }=mutationUpdate;
  useEffect(()=>{
    if(isSuccessUpdate&&dataUpdate.status==='OK') {
        onCancel();
        alertSuccess("Thành công", "Cập nhật thương hiệu thành công");
        setIsOpenDrawer(false)
        queryClient.invalidateQueries(['brands']); 
    }
    else if(isErrorUpdate) {
         alertError("Thất bại", errorUpdate?.message);
    }
  },[isErrorUpdate,isSuccessUpdate,dataUpdate])

  const mutationCreate = useMutationHook( async({data,access_token}) =>{
        return await BrandService.createBrand(data,access_token);
  }) 

  const {isSuccess: isSuccessCreate,isError: isErrorCreate,
    isPending:isPendingCreate,error:errorCreate,data:dataCreate }=mutationCreate;

    useEffect(()=>{
      if(isSuccessCreate&&dataCreate.status==='OK') {
          onCancel();
          alertSuccess("Thành công", "Thêm thương hiệu thành công");
          queryClient.invalidateQueries(['brands']); 
      }
      else if(isErrorCreate) {
        console.log('ok')
          alertError("Thất bại", errorCreate?.message);
      }
    },[isErrorCreate,isSuccessCreate,dataCreate])


  const onCreateBrand=(values)=>{
     const formData= new FormData();
     formData.append("name",values.name);
     formData.append("description",values.description||'');
     if (fileListCreate[0]) {
      formData.append('logo', fileListCreate[0].originFileObj);
    }
    mutationCreate.mutate({data:formData,access_token:user.access_token})
  }
  
  const onUpdateBrand=(values) =>{

     const formData= new FormData();
     formData.append("name",values.name);
     formData.append("description",values.description||'');
     formData.append("isActive",values.isActive);
      if (fileListUpdate[0]?.originFileObj) {
        formData.append('logo', fileListUpdate[0].originFileObj);
      }
      else if (fileListUpdate[0]?.url) {
        formData.append('logo', fileListUpdate[0].url); 
      }
    mutationUpdate.mutate({id:rowSelected,data:formData,access_token:user?.access_token})
  }

  return (
    <div className='Admin_brand'>
      <h1 className='title'>Quản lý thương hiệu</h1>
      <Button className='btn_add' onClick={() => setIsModalOpen(true)}>
          <PlusOutlined /> Thêm thương hiệu
      </Button>

       <ButtonInputSearch 
        size="middle" 
        placeholder="Tìm kiếm sản phẩm..." 
        textButton="Tìm" 
        bgrColorInput="#fff"
        bgrColorButton="#1890ff"
        textColorButton="#fff"
        onChangeSearch={onChangeSearch}    
        onClickSearch={onSearch}            
        value={inputSearch}      
      />


      <Modal
        title="Thêm thương hiệu"
        footer={null}
        open={isModalOpen}
        onCancel={onCancel}
      >
        <BrandFormComponent 
            form={formCreate}
            onFinish={onCreateBrand}
            fileList={fileListCreate}
            setFileList={setFileListCreate}
            isLoading={isPendingCreate}
            mode='create'
        />
      </Modal>
      
      <DrawerComponent  title='Chi tiết thương hiệu' isOpen={isOpenDrawer} 
                         onClose={()=> setIsOpenDrawer(false)}
                         width="83.5%" >
         <BrandFormComponent 
            form={formUpdate}
            onFinish={onUpdateBrand}
            fileList={fileListUpdate}
            setFileList={setFileListUpdate}
            isLoading={isPendingUpdate}
            mode='update'
        />
      </DrawerComponent>

      <TableComponents data={dataTable} columns={columns}
            handleDeleteManyUser={handleDeleteManyBrand}
            pagination={{
            current: currentPage,
            pageSize: limit,
            total: Brands?.total || 1,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
            isLoading={isLoadingBrands} 
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => setRowSelected(record._id),   
            }}}

      />
    </div>
  )
}
export default AdminBrand