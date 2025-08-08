import React from 'react';
import { Form, Button, Upload, Select } from 'antd';
import InputComponent from '../../InputComponent/InputComponent';
import *as NoteGroupService from "../../../services/NoteGroup.Service";
import { useQuery } from '@tanstack/react-query';

const { Option } = Select;

const BrandFormComponent = ({form,
    onFinish,isLoading,mode = 'create' }) => {
    
  const { data, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['note-groups'],
    queryFn: NoteGroupService.getAllNoteGroup,
  });
  const groups=data?.data||[];
  console.log(groups)

  return (
    <Form
      form={form}
      name={`${mode}_note_form`}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      autoComplete="off"
      initialValues
    >
      
       <Form.Item
        label="Tên mùi hương"
        name="name"
        rules={[
          { required: true, message: 'Vui lòng nhập tên mùi hương' }
        ]}
       >
            <InputComponent />
       </Form.Item>
      
        <Form.Item
            label="Loại hương"
            name="type"
             rules={[
            { required: true, message: 'Vui lòng chọn loại hương' }
            ]}
        >
            <Select placeholder="Chọn loại hương ">

                <Option value="top">Hương đầu</Option>
                <Option value="middle">Hương giữa</Option>
                <Option value="base">Hương cuối</Option>

            </Select>
        

        </Form.Item>

        <Form.Item
            label="Nhóm hương"
            name="group"
             rules={[
            { required: true, message: 'Vui lòng chọn nhóm hương' }
            ]}
        >
                <Select placeholder="Chọn nhóm hương">
                    {groups.map((group) => (
                      <Option key={group._id} value={group._id}>
                        {group.name}
                      </Option>
                    ))}          
                </Select>
        </Form.Item>


     

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={isLoading}>
                {mode === 'create' ? 'Thêm mùi hương' : 'Cập nhật mùi hương'}
            </Button>
        </Form.Item>
    </Form>
  );
};

export default BrandFormComponent;
