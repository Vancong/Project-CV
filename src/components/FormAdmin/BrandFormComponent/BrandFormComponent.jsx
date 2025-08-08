import React from 'react';
import { Form, Button, Upload, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import InputComponent from '../../InputComponent/InputComponent';
const { Option } = Select;

const BrandFormComponent = ({form,fileList,setFileList,
    onFinish,isLoading,mode = 'create' }) => {

  const handleOnchangeImage = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemoveImage = (file) => {
    setFileList(prev => prev.filter(item => item.uid !== file.uid));
  };
  return (
    <Form
      form={form}
      name={`${mode}_user_form`}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      autoComplete="off"
      initialValues
    >

      <Form.Item
        label="Tên thương hiệu"
        name="name"
        rules={[
          { required: true, message: 'Vui lòng nhập tên thương hiệu' }
        ]}
      >
        <InputComponent />
      </Form.Item>
      

      {mode==='update' &&(
        <Form.Item
          label="Trạng thái"
          name="isActive"
        >
              <Select placeholder="Chọn trạng thái">
                    <Option value={true}>Hoạt động</Option>
                    <Option value={false}>Dừng hoạt động</Option>             
               </Select>
        </Form.Item>
      )}


      <Form.Item
          label="Mô tả"
          name="description"
      >
          <InputComponent />
      </Form.Item>

        
      
        <Form.Item
              label="Hình ảnh"
              rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}
              name="logo"
              
            >
              <Upload
                multiple
                listType="picture-card"
                fileList={fileList}
                onChange={handleOnchangeImage}
                onRemove={handleRemoveImage}
                beforeUpload={() => false}
                accept="image/*"
              >
                {fileList.length ===0 && '+ Upload'}
              </Upload>
  
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={isLoading}>
                {mode === 'create' ? 'Thêm thương hiệu' : 'Cập nhật thương hiệu'}
            </Button>
        </Form.Item>
    </Form>
  );
};

export default BrandFormComponent;
