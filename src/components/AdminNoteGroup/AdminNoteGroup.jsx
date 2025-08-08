import { Button, Modal,Form, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import {PlusOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons';
import BrandFormComponent from  "../FormAdmin/BrandFormComponent/BrandFormComponent"
import { useMutationHook } from '../../hooks/useMutationHook';
import * as NoteGroupService from "../../services/NoteGroup.Service"
import { alertSuccess,alertConfirm,alertError } from '../../utils/alert';
import { useSelector } from 'react-redux';
import TableComponents from '../TableComponents/TableComponents';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import InputComponent from '../InputComponent/InputComponent';


const AdminNoteGroup = () => {
  const [isModalOpen,setIsModalOpen]=useState(false);
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


  const { isLoading:isLoadingNoteGroup , data: NoteGroups } = useQuery({
    queryKey: ['note-groups', currentPage,searchText],
    queryFn: () => NoteGroupService.getAllNoteGroup(currentPage, limit,searchText ),
    keepPreviousData: true
  });

  const dataTable= (NoteGroups?.data||[]).map(noteGroup => ({...noteGroup,key:noteGroup._id}))


  const columns = [
    {
      title: 'Tên nhóm hương',
      dataIndex: 'name',
      render: text => <a>{text}</a>,
      sorter: (a,b) => a.name.length - b.name.length
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render:  (_, record) => renderAcion(_, record)  
    },
    
  ];

  const handleDetailNoteGroup= async(record) =>{
    setRowSelected(record?._id);
        try {
          const res = await NoteGroupService.getDetailNoteGroup(record?._id);

          if(res?.data){
            const noteGroup = res.data;
            formUpdate.setFieldsValue({
              name: noteGroup.name,
            })
          }    
           setIsOpenDrawer(true);
        } catch (error) {
          alertError('Lỗi', 'Không thể tải chi tiết thương hiệu');
        }
  }
  const handleDeleteNoteGroup=async (record) =>{
    const confirm =  await alertConfirm('Xác nhận xoá', `Bạn có chắc muốn xoá nhóm hương "${record.name}"?`);
        if (!confirm) return;
    
    deleteNoteGroupMutation.mutate({ id: record._id, access_token: user?.access_token });
  }
  const deleteNoteGroupMutation = useMutationHook(async ({ id, access_token }) => {
      return await  NoteGroupService.deleteNoteGroup(id, access_token )
  });

   const{data:dataDelete, isPending: isPendingDelete,isSuccess: isSuccessDelete,
    isError:isErrorDelete}=deleteNoteGroupMutation;
    useEffect(() => {
      if (isSuccessDelete && dataDelete?.status === 'OK') {
        alertSuccess('Thành công', 'Xoá nhóm hương thành công!');
        queryClient.invalidateQueries(['note-groups']); 
      }
      if (isErrorDelete) {
        alertError('Thất bại', dataDelete?.message || 'Đã có lỗi xảy ra khi xoá.');
      }
    }, [isSuccessDelete, isErrorDelete]);
  


  const renderAcion= (_,record) =>{
    return(
      <div style={{fontSize:'20px'}}>
        <EditOutlined  style={{color:'orange',cursor:'pointer',marginRight:'10px'}}
                         onClick={()=> { handleDetailNoteGroup(record)}}
        />
        <DeleteOutlined style={{color:'red',cursor:'pointer'}} 
                        onClick={ () => handleDeleteNoteGroup(record)}  
        />
      </div>
    )
  }

  const onCancel= () =>{
    setIsModalOpen(false);
    formCreate.resetFields();
  }

  const mutationUpdate= useMutationHook (async ({id,data,access_token})=>{
      return await NoteGroupService.updateNoteGroup(id,data,access_token)
  })

  const {isSuccess: isSuccessUpdate, isError: isErrorUpdate,
    isPending:isPendingUpdate,error:errorUpdate,data:dataUpdate }=mutationUpdate;
  useEffect(()=>{
    if(isSuccessUpdate&&dataUpdate.status==='OK') {
        onCancel();
        alertSuccess("Thành công", "Cập nhật nhóm hương thành công");
        setIsOpenDrawer(false)
        queryClient.invalidateQueries(['note-groups']); 
    }
    else if(isErrorUpdate) {
         alertError("Thất bại", errorUpdate?.message);
    }
  },[isErrorUpdate,isSuccessUpdate,dataUpdate])

  const mutationCreate = useMutationHook( async({data,access_token}) =>{
        return await NoteGroupService.createNoteGroup(data,access_token);
  }) 

  const {isSuccess: isSuccessCreate,isError: isErrorCreate,
    isPending:isPendingCreate,error:errorCreate,data:dataCreate }=mutationCreate;

    useEffect(()=>{
      if(isSuccessCreate&&dataCreate.status==='OK') {
          onCancel();
          alertSuccess("Thành công", "Thêm nhóm hương thành công");
          queryClient.invalidateQueries(['note-groups']); 
      }
      else if(isErrorCreate) {

          alertError("Thất bại", errorCreate?.message);
      }
    },[isErrorCreate,isSuccessCreate,dataCreate])


  const onCreateNoteGroup=(values)=>{
    const data={
        name: values.name,
    }
    mutationCreate.mutate({data,access_token:user.access_token})
  }
  
  const onUpdateNoteGroup=(values) =>{
    const data={
        name: values.name,
    }
    mutationUpdate.mutate({id:rowSelected,data,access_token:user?.access_token})
  }

  return (
    <div className='Admin_note_group'>
      <h1 className='title'>Quản lý nhóm hương</h1>
      <Button className='btn_add' onClick={() => setIsModalOpen(true)}>
          <PlusOutlined /> Thêm nhóm hương
      </Button>

       <ButtonInputSearch 
        size="middle" 
        placeholder="Tìm kiếm nhóm hương..." 
        textButton="Tìm" 
        bgrColorInput="#fff"
        bgrColorButton="#1890ff"
        textColorButton="#fff"
        onChangeSearch={onChangeSearch}    
        onClickSearch={onSearch}            
        value={inputSearch}      
      />


    <Modal
        title="Thêm nhóm hương"
        footer={null}
        open={isModalOpen}
        onCancel={onCancel}
      >
        <Form
            form={formCreate}
            name={`create_noteGroup_form`}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onCreateNoteGroup}
            autoComplete="off"
            initialValues
        >

            <Form.Item
                label="Tên nhóm hương"
                name="name"
                rules={[
                { required: true, message: 'Vui lòng nhập tên nhóm hương' }
                ]}
            >
                <InputComponent />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" loading={isPendingCreate}>
                         Thêm nhóm hương
                    </Button>
            </Form.Item>
       </Form>

    </Modal>
      
    <DrawerComponent  title='Chi tiết thương hiệu' isOpen={isOpenDrawer} 
                        onClose={()=> setIsOpenDrawer(false)}
                        width="83.5%" >

        <Form
            form={formUpdate}
            name={`update_noteGroup_form`}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onUpdateNoteGroup}
            autoComplete="off"
            initialValues
        >

            <Form.Item
                label="Tên nhóm hương"
                name="name"
                rules={[
                { required: true, message: 'Vui lòng nhập tên nhóm hương' }
                ]}
            >
                <InputComponent />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" loading={isPendingUpdate}>
                         Cập nhật nhóm hương
                    </Button>
            </Form.Item>
       </Form>
    </DrawerComponent>

      <TableComponents data={dataTable} columns={columns}
            pagination={{
            current: currentPage,
            pageSize: limit,
            total: (NoteGroups?.totalPage || 1) * limit,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
            isLoading={isLoadingNoteGroup} 
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => setRowSelected(record._id),   
            }}}

      />
    </div>
  )
}
export default AdminNoteGroup