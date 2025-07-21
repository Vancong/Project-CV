import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Upload, Select, Tag, Input } from 'antd';
import { PlusOutlined,DeleteOutlined,EditOutlined } from '@ant-design/icons';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as ProductService from '../../services/Product.Services';
import TableComponents from '../TableComponents/TableComponents';
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { alertSuccess,alertConfirm,alertWarning,alertError } from '../../utils/alert';
import "./AdminProduct.scss"
import { useQuery,useQueryClient } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import ProductFormComponent from "../ProductFormComponent/ProductFormComponent"
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch"
import { data } from 'react-router-dom';



const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[isFormSubmit,setIsFormSubmit]=useState(false);
  const [rowSelected,setRowSelected]=useState('');
  const [isOpenDrawer,setIsOpenDrawer]=useState(false);
  const [productData, setProductData] = useState(null);
  const [fileListCreate, setFileListCreate] = useState([]);
  const [fileListUpdate, setFileListUpdate] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const limit=2;

  const [inputSearch, setInputSearch] = useState('');
  const [searchText, setSearchText] = useState('');

  const onChangeSearch = (e) => {
    setInputSearch(e.target.value);
  };

  const onSearch = () => {
    setCurrentPage(1);
    setSearchText(inputSearch);
  };
  
  const user= useSelector(state => state?.user);
  const queryClient = useQueryClient();
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();

  useEffect(() => {
    if (isModalOpen) {
      formCreate.setFieldsValue({
        sizes: [{ volume: '', price: '', countInStock: '' }]
      });
      setFileListCreate([]); 
    }
  }, [isModalOpen]);


  const handleCancel = () => {
    setIsModalOpen(false);
    formCreate.resetFields();
    setFileListCreate([]);
  };


  const getAllProduct = async (page = 1, limit = 10,search = '') => {
    const res = await ProductService.getAllProduct( page, limit ,search);
    return res;
  };

  
  const { isLoading:isLoadingProducts , data: products } = useQuery({
    queryKey: ['products', currentPage,searchText],
    queryFn: () => ProductService.getAllProduct(currentPage, limit,searchText ),
    keepPreviousData: true
  });



  const handleDetailProduct = async (record) => {
    setRowSelected(record?._id);
    try {
      const res = await ProductService.getDetailProduct(record?._id);
      if(res?.data){
        const product = res.data;
        setProductData(product);
        formUpdate.setFieldsValue({
          name: product.name,
          description: product.description,
          brand: product.brand,
          gender: product.gender,
          concentration: product.concentration,
          scentDuration: product.scentDuration,
          discount: product.discount,
          sizes: product.sizes,
          isActive: product.isActive
        });

        if(product.images?.length > 0){
          const imageList = product.images.map((url) => ({
            uid: url,
            name: url.substring(url.lastIndexOf('/') + 1),
            status: 'OK',
            url,
          }));
          setFileListUpdate(imageList);
        } else {
          setFileListUpdate([]);
        }

        setIsOpenDrawer(true);
      }
    } catch (error) {
      alertError('Lỗi', 'Không thể tải chi tiết sản phẩm');
    }
  };

  const renderAcion= (_,record) =>{
    return(
      <div style={{fontSize:'20px'}}>
        <EditOutlined  style={{color:'orange',cursor:'pointer',marginRight:'10px'}}
                         onClick={()=> { handleDetailProduct(record)}}
        />
        <DeleteOutlined style={{color:'red',cursor:'pointer'}} 
                        onClick={ () => handleDeleteProduct(record)}  
        />
      </div>
    )
  }

  const handleDeleteProduct = async (record) => {
    const confirm = await alertConfirm('Xác nhận xoá', `Bạn có chắc muốn xoá sản phẩm "${record.name}"?`);
    if (!confirm) return;

     deleteProductMutation.mutate({ id: record._id, access_token: user?.access_token });
  };


  const deleteProductMutation = useMutationHook(async ({ id, access_token }) => {
    return await  ProductService.deleteProduct(id, access_token )
  });

  const{data:dataDelete, isPending: isPendingDelete,isSuccess: isSuccessDelete,isError:isErrorDelete}=deleteProductMutation;
  useEffect(() => {
    if (isSuccessDelete && dataDelete?.status === 'OK') {
      alertSuccess('Thành công', 'Xoá sản phẩm thành công!');
      queryClient.invalidateQueries(['products']); 
    }
    if (isErrorDelete) {
      alertError('Thất bại', dataDelete?.message || 'Đã có lỗi xảy ra khi xoá.');
    }
  }, [isSuccessDelete, isErrorDelete]);


  const mutationDeleteManyProduct = useMutationHook(async ({ ids, access_token }) => {
    return await  ProductService.deleteManyProduct( ids, access_token )
  });

  const handleDeleteManyProduct= async (ids) =>{
    const confirm = await alertConfirm('Xác nhận xoá', `Bạn có chắc muốn xoá sản phẩm "?`);
    if (!confirm) return;
    mutationDeleteManyProduct.mutate({ids, access_token: user?.access_token})
  }
  
  const{data:dataDeleteMany, isPending: isPendingDeleteMany
    ,isSuccess: isSuccessDeleteMany,isError:isErrorDeleteMany}=mutationDeleteManyProduct;
  useEffect(() => {
    if (isSuccessDeleteMany && dataDeleteMany?.status === 'OK') {
      alertSuccess('Thành công', 'Xoá sản phẩm thành công!');
      queryClient.invalidateQueries(['products']); 
    }
    if (isErrorDeleteMany) {
      alertError('Thất bại', dataDeleteMany?.message || 'Đã có lỗi xảy ra khi xoá.');
    }
  }, [isSuccessDeleteMany, isErrorDeleteMany]);



  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      render: text => <a>{text}</a>,
      sorter: (a,b) => a.name.length - b.name.length
    },
    {
      title: 'Giá',
      render: (_,record) =>{
         if(record?.sizes.length>0) {
          const price = record.sizes[0].price;
          return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
         }
      },
      sorter: (a, b) => {
        const priceA = a.sizes?.[0]?.price;
        const priceB = b.sizes?.[0]?.price ;
        return priceA - priceB;
      }
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
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
  
  const dataTable = (products?.data || []).map(product => ({ ...product, key: product._id }));



  const mutationCreate = useMutationHook(async (formData) => {
    return await ProductService.createProduct(formData);
  });

  const { data: dataCreate, isSuccess: isSuccessCreate, isError: isErrorCreate, 
        isPending: isPendingCreate, error: errorCreate } = mutationCreate;

  useEffect( () => {  
    if(isSuccessCreate&&dataCreate?.status==='OK'){
      handleCancel();
      alertSuccess("Thành công", "Tạo sản phẩm thành công");
      queryClient.invalidateQueries(['products']);
    }
    if(isErrorCreate&&errorCreate?.response?.data?.status==='ERR'){

      alertError("Thất bại",errorCreate.response.data.message);
    }
  },[isSuccessCreate,isErrorCreate])

  
  const mutationUpdate = useMutationHook(async ({id,access_token,data}) => {
    return await ProductService.updateProduct(id,access_token,data);
  });

  const {
      data: dataUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      isPending: isPendingUpdate,
      error: errorUpdate
  } = mutationUpdate;


  useEffect( () => {
      
    if(isSuccessUpdate&&dataUpdate?.status==='OK'){
      handleCancel();
      alertSuccess("Thành công", "Cập nhật sản phẩm thành công");
       queryClient.invalidateQueries(['products']);
       setIsOpenDrawer(false)
    }
    if(isErrorUpdate&&errorUpdate?.response?.data?.status==='ERR'){

      alertError("Thất bại",errorUpdate.response.data.message);
      handleCancel();
    }
  },[isSuccessUpdate,isErrorUpdate])

  const convertFormData = (values, fileList, isUpdate = false) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description || '');
    formData.append('brand', values.brand);
    formData.append('gender', values.gender);
    formData.append('concentration', values.concentration);
    formData.append('scentDuration', values.scentDuration);
    formData.append('discount', values.discount || 0);
    formData.append('sizes', JSON.stringify(values.sizes));

    fileList.forEach(file => {
      if (file.originFileObj) {
        formData.append('images', file.originFileObj);
      }
    });

    if (isUpdate) {
      formData.append('isActive', values.isActive );
      const oldImages = fileList
        .filter(file => !file.originFileObj)
        .map(file => file.url);
      formData.append('oldImages', JSON.stringify(oldImages));
    }

    return formData;
  };

  
  const onCreateProduct = (values) => {
    if(fileListCreate.length===0) {
      setIsFormSubmit(true);
      return;
    }
    setIsFormSubmit(false)
    const formData=convertFormData(values,fileListCreate);
    mutationCreate.mutate(formData);
  };


  const onUpdateProduct= (values) =>{
      if(fileListUpdate.length===0) {
        setIsFormSubmit(true);
        return;
      }
      setIsFormSubmit(false)

      const formData=convertFormData(values, fileListUpdate, true);
      mutationUpdate.mutate({id:rowSelected,access_token:user?.access_token,data: formData});
  }

return (
    <div className='admin_product'>
      <h1 className='title'>Quản lý sản phẩm</h1>
      <Button className='btn_add' onClick={() => setIsModalOpen(true)}>
        <PlusOutlined /> Thêm
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
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <LoadingComponent isPending={isPendingCreate}>
          <ProductFormComponent
            form={formCreate}
            onFinish={onCreateProduct}
            fileList={fileListCreate}
            setFileList={setFileListCreate}
            isFormSubmit={isFormSubmit}
            isLoading={isPendingCreate}
            initialValues={{ sizes: [{ volume: '', price: '', countInStock: '' }] }}
          />

        
        </LoadingComponent>
      </Modal>
      <TableComponents data={dataTable} columns={columns} isLoading={isLoadingProducts}
          handleDeleteManyProduct={handleDeleteManyProduct}
          pagination={{
            current: currentPage,
            pageSize: limit,
            total: (products?.totalPage || 1) * limit,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => setRowSelected(record._id),
            
          }}}
       />
       <DrawerComponent  title='Chi tiết sản phẩm' isOpen={isOpenDrawer} 
                         onClose={()=> setIsOpenDrawer(false)}
                         width="83.5%"
       >
          <LoadingComponent isPending={isPendingUpdate}>
              <ProductFormComponent
                form={formUpdate}
                fileList={fileListUpdate}
                setFileList={setFileListUpdate}
                onFinish={onUpdateProduct}
                isLoading={isPendingUpdate}
                isFormSubmit={isFormSubmit}
                mode="update"
                initialValues={productData} 
              />
          </LoadingComponent>
       </DrawerComponent>
    </div>
  );
};

export default AdminProduct;
