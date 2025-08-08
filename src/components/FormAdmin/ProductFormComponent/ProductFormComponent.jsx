import React from 'react';
import { Form, Button, Upload, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import InputComponent from '../../InputComponent/InputComponent';
import {Fomater} from "../../../utils/fomater"
import * as BrandService from "../../../services/Brand.Service";
import *as NoteService from "../../../services/Note.Service"
import { useQuery } from '@tanstack/react-query';
const { Option } = Select;

const ProductForm = ({form,fileList,setFileList,onFinish,isLoading,isFormSubmit,mode = 'create',
  initialValues }) => {
  const { data: brands, isLoading: isLoadingBrands } = useQuery({
    queryKey: ['brands'],
    queryFn: ()=> BrandService.getAllBrand(),
  });
  const brandsData=brands?.data||[];
  

  const { data: notes, isLoading: isLoadingNotes } = useQuery({
    queryKey: ['notes'],
    queryFn: ()=> NoteService.getAllNote(),
  });
  const notesData= notes?.data ||[];

  const handleOnchangeImage = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemoveImage = (file) => {
    setFileList(prev => prev.filter(item => item.uid !== file.uid));
  };

  return (
    <Form
      form={form}
      name={`${mode}_product_form`}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      autoComplete="off"
      initialValues={ initialValues || {
        sizes: [{ volume: '', price: '', countInStock: '' }],
        discount: 0,
      }}
    >
      <Form.Item
        label="Tên sản phẩm"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
      >
        <InputComponent />
      </Form.Item>

      <Form.List
        name="sizes"
        rules={[
          {
            validator: async (_, sizes) => {
              if (!sizes || sizes.length === 0) {
                return Promise.reject(new Error('Phải có ít nhất một size.'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                <Form.Item
                  {...restField}
                  name={[name, 'volume']}
                  rules={[{ required: true, message: 'Nhập dung tích' }]}
                  style={{ marginBottom: 0 }}
                >
                  <InputComponent placeholder="Dung tích (ml)" type="number" min={0} />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'price']}
                  rules={[{ required: true, message: 'Nhập giá' }]}
                  style={{ marginBottom: 0 }}
                >
                  <InputComponent placeholder="Giá (VND)" type="number" min={0} />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'countInStock']}
                  rules={[{ required: true, message: 'Nhập tồn kho' }]}
                  style={{ marginBottom: 0, marginRight: 0 }}
                >
                  <InputComponent placeholder="Tồn kho" type="number" min={0} />
                </Form.Item>

                <Button danger onClick={() => remove(name)}>x</Button>
              </div>
            ))}

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                Thêm size
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      
      <Form.Item
        label="Hương đầu"
        name={['notes', 'top']}
        rules={[{ required: true, message: 'Vui lòng chọn hương đầu!' }]}
      >
        <Select mode="multiple" placeholder="Chọn các hương đầu">
          {notesData&& notesData?.filter(note => note.type === 'top').map(note => (
            <Option key={note._id} value={note._id}>
              {note.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Hương giữa"
        name={['notes', 'middle']}
        rules={[{ required: true, message: 'Chọn ít nhất 1 hương giữa' }]}
      >
        <Select mode="multiple" placeholder="Chọn các hương giữa">
          {notesData&& notesData?.filter(note => note.type === 'middle') .map(note => (
              <Option key={note._id} value={note._id}>
                {note.name}
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Hương cuối"
        name={['notes', 'base']}
        rules={[{ required: true, message: 'Chọn ít nhất 1 hương cuối' }]}
      >
        <Select mode="multiple" placeholder="Chọn các hương cuối">
          {notesData&& notesData?.filter(note => note.type === 'base').map(note => (
              <Option key={note._id} value={note._id}>
                {note.name}
              </Option>
            ))}
        </Select>
      </Form.Item>



      <Form.Item
        label="Giảm giá (%)"
        name="discount"
      >
        <InputComponent
          type="number"
          min={0}
          max={100}
          name="discount"
        />
      </Form.Item>

      <Form.Item
        label="Giới tính"
        name="gender"
        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
      >
        <Select placeholder="Chọn giới tính">
          <Option value="Male">Nam</Option>
          <Option value="Female">Nữ</Option>
          <Option value="Unisex">Unisex</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Thương hiệu"
        name="brand"
        rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
      >
         <Select placeholder="Chọn thương hiệu">
            {brandsData?.map(brand => (
              <Option key={brand._id} value={brand._id}>
                {brand.name}
              </Option>
            ))}
         </Select>
      </Form.Item>

      <Form.Item
        label="Nồng độ"
        name="concentration"
        rules={[{ required: true, message: 'Vui lòng chọn nồng độ!' }]}
      >
        <Select placeholder="Chọn nồng độ">
          <Option value="Parfum">Parfum</Option>
          <Option value="Eau de Parfum">Eau de Parfum</Option>
          <Option value="Eau de Toilette">Eau de Toilette</Option>
          <Option value="Eau de Cologne">Eau de Cologne</Option>
          <Option value="Body Mist">Body Mist</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Độ lưu hương"
        name="scentDuration"
        rules={[{ required: true, message: 'Vui lòng chọn độ lưu hương!' }]}
      >
        <Select placeholder="Chọn độ lưu hương">
          <Option value="3–4 giờ">3–4 giờ</Option>
          <Option value="4–6 giờ">4–6 giờ</Option>
          <Option value="6–8 giờ">6–8 giờ</Option>
          <Option value="Trên 8 giờ">Trên 8 giờ</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label={
          <span>
            <span style={{ color: 'red', fontSize: '18px' }}>*</span> Hình ảnh
          </span>
        }
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
          {fileList.length < 5 && '+ Upload'}
        </Upload>
        {isFormSubmit && fileList.length === 0 && (
          <div style={{ color: 'red', marginTop: 4 }}>Vui lòng chọn ảnh!</div>
        )}
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

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
            {mode === 'create' ? 'Tạo sản phẩm' : 'Cập nhật sản phẩm'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
