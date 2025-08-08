import { Button, Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import {PlusOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons'
import NoteFormComponent from "../FormAdmin/NoteFormComponent/NoteFormComponent"
import *as NoteService from "../../services/Note.Service"
import { useSelector } from 'react-redux'
import { alertConfirm, alertError, alertSuccess } from '../../utils/alert'
import { useMutationHook } from '../../hooks/useMutationHook'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import TableComponents from '../TableComponents/TableComponents'
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
const AdminNote = () => {
  const [isModalOpen,setIsModalOpen]=useState(false);
  const user=useSelector(state => state.user)
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSelected,setRowSelected]=useState('');
  const [isOpenDrawer,setIsOpenDrawer]=useState(false);
  const queryClient = useQueryClient();
  const [formCreate]= Form.useForm();
  const [formUpdate]= Form.useForm();
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
  

  const onCancel= () =>{
    setIsModalOpen(false);
    formCreate.resetFields();
  }

    const { isLoading:isLoadingNotes , data: Notes } = useQuery({
    queryKey: ['notes', currentPage,searchText],
    queryFn: () => NoteService.getAllNote(currentPage, limit,searchText ),
    keepPreviousData: true
  });

  const NOTE_TYPE_LABELS = {
    top: 'Hương đầu',
    middle: 'Hương giữa',
    base: 'Hương cuối',
  };

  const dataTable= (Notes?.data||[]).map(note => ({...note,key:note._id,type: NOTE_TYPE_LABELS[note.type],
    group: note?.group?.name
  }))


  const columns = [
    {
      title: 'Tên mùi hương',
      dataIndex: 'name',
      render: text => <a>{text}</a>,
      sorter: (a,b) => a.name.length - b.name.length
    },
     {
      title: 'Loại hương',
      dataIndex: "type",
      render: (type) =>  <span>{type}</span>
    },
    {
      title: 'Nhóm hương',
      dataIndex: "group",
      render: (group) =>  <span>{group}</span>
    },
     {
      title: 'Hành động',
      dataIndex: 'action',
      render:  (_, record) => renderAcion(_, record)  
    },
  
  ];

  const handleDetailNote= async(record) =>{
    setRowSelected(record?._id);
        try {
          const res = await NoteService.getDetailNote(record?._id);
          if(res?.data){
            const note = res.data;
            formUpdate.setFieldsValue({
              name: note.name,
              group: note.group,
              type: note.type
            })
          }    
            setIsOpenDrawer(true);
        } catch (error) {
          alertError('Lỗi', 'Không thể tải chi tiết thương hiệu');
        }
  }
  const handleDeleteNote=async (record) =>{
     const confirm =  await alertConfirm('Xác nhận xoá', `Bạn có chắc muốn xoá mùi hương "${record.name}"?`);
      if (!confirm) return;
     
     deleteNoteMutation.mutate({ id: record._id, access_token: user?.access_token });
  }
  const deleteNoteMutation = useMutationHook(async ({ id, access_token }) => {
       return await  NoteService.deleteNote(id, access_token )
  });
 
  const{data:dataDelete, isPending: isPendingDelete,isSuccess: isSuccessDelete,
    isError:isErrorDelete}=deleteNoteMutation;
  useEffect(() => {
      if (isSuccessDelete && dataDelete?.status === 'OK') {
        alertSuccess('Thành công', 'Xoá mùi hương thành công!');
        queryClient.invalidateQueries(['notes']); 
      }
      if (isErrorDelete) {
        alertError('Thất bại', dataDelete?.message || 'Đã có lỗi xảy ra khi xoá.');
      }
  }, [isSuccessDelete, isErrorDelete]);

  const renderAcion= (_,record) =>{
    return(
      <div style={{fontSize:'20px'}}>
        <EditOutlined  style={{color:'orange',cursor:'pointer',marginRight:'10px'}}
                          onClick={()=> { handleDetailNote(record)}}
        />
        <DeleteOutlined style={{color:'red',cursor:'pointer'}} 
                        onClick={ () => handleDeleteNote(record)}  
        />
      </div>
    )
  }
 const mutationCreate = useMutationHook( async({data,access_token}) =>{
        return await NoteService.createNote(data,access_token);
  }) 
  const {isSuccess: isSuccessCreate,isError: isErrorCreate,
      isPending:isPendingCreate,error:errorCreate,data:dataCreate }=mutationCreate;
    useEffect(()=>{
      if(isSuccessCreate&&dataCreate.status==='OK') {
          onCancel();
          alertSuccess("Thành công", "Thêm mùi hương thành công");
          queryClient.invalidateQueries(['notes']); 
      }
      else if(isErrorCreate) {
          alertError("Thất bại", errorCreate?.message);
      }
    },[isErrorCreate,isSuccessCreate,dataCreate])

  const onCreateNote= (values) =>{
      const data={
        name: values.name,
        type:values.type,
        group: values.group
      }
      mutationCreate.mutate({data,access_token:user?.access_token})
    
  }
   const mutationUpdate= useMutationHook (async ({id,data,access_token})=>{
        return await NoteService.updateNote(id,data,access_token)
    })
  
  const {isSuccess: isSuccessUpdate, isError: isErrorUpdate,
      isPending:isPendingUpdate,error:errorUpdate,data:dataUpdate }=mutationUpdate;
  useEffect(()=>{
      if(isSuccessUpdate&&dataUpdate.status==='OK') {
          onCancel();
          alertSuccess("Thành công", "Cập nhật mùi hương thành công");
          setIsOpenDrawer(false)
          queryClient.invalidateQueries(['notes']); 
      }
      else if(isErrorUpdate) {
           alertError("Thất bại", errorUpdate?.message);
      }
  },[isErrorUpdate,isSuccessUpdate,dataUpdate])
  const onUpdateNote= (values) =>{
    const data={
        name: values.name,
        type: values.type,
        group: values.group,
      }
    mutationUpdate.mutate({id:rowSelected,data,access_token:user?.access_token})
  }

  return (
    <div className='admin_note'>
      <h1 className='title'>Quản lý mùi hương</h1>
      <Button className='btn_add' onClick={() => setIsModalOpen(true)}>
          <PlusOutlined /> Thêm mùi hương
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
        title="Thêm mùi hương"
        footer={null}
        open={isModalOpen}
        onCancel={onCancel}
      >
      
      <NoteFormComponent
          form={formCreate}
          onFinish={onCreateNote}
          isLoading={isPendingCreate}
          mode='create'
      />



      </Modal>

      <DrawerComponent  title='Chi tiết thương hiệu' isOpen={isOpenDrawer} 
                         onClose={()=> setIsOpenDrawer(false)}
                         width="83.5%" >
         <NoteFormComponent 
            form={formUpdate}
            onFinish={onUpdateNote}
            // isLoading={isPendingUpdate}
            mode='update'
        />
      </DrawerComponent>

      <TableComponents data={dataTable} columns={columns}
            pagination={{
            current: currentPage,
            pageSize: limit,
            total:Notes?.total || 1,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
            isLoading={isLoadingNotes} 
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => setRowSelected(record._id),   
            }}}

      />
    </div>
  )
}

export default AdminNote