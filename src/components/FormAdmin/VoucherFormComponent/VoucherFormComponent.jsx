import React, { useEffect, useState } from 'react';
import { Form, Button, Upload, Select ,DatePicker, InputNumber, Radio} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import InputComponent from '../../InputComponent/InputComponent';
const { Option } = Select;


const VoucherFormComponent = ({form,onFinish,isLoading,mode = 'create' }) => {

  const [discountType, setDiscountType] = useState(null);

  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
  };

  useEffect(() => {
    setDiscountType(form.getFieldValue('discountType'));
  },[]);

  const [startDate, setStartDate] =useState(null)
  const [endDate, setEndDate] = useState(null);

    const disabledStartDate = (current) => {
        if (!current) return false;
        if (endDate) {
        return current > endDate;
        }
        return false;
    };


   const disabledEndDate = (current) => {
        if (!current) return false;
        if (startDate) {
        return current < startDate;
        }
        return false;
    };

  return (
    <Form
      form={form}
      name={`${mode}_user_form`}
      labelCol={{ span: 12 }}
      wrapperCol={{ span: 20 }}
      onFinish={onFinish}
      autoComplete="off"
      initialValues
    >

      <Form.Item
        label="Mã giảm giá"
        name="code"
        rules={[
          { required: true, message: 'Vui lòng nhập mã giảm giá' }
        ]}
      >
        <InputComponent />
      </Form.Item>

      <Form.Item
        label="Loại giảm giá"
        name="discountType"
        rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá' }]}
      >
        <Radio.Group onChange={handleDiscountTypeChange}>
          <Radio value="percentage">Phần trăm (%)</Radio>
          <Radio value="fixed">Số tiền cố định</Radio>
        </Radio.Group>
      </Form.Item>

      {discountType && (
        <Form.Item
          label={discountType === 'percentage' ? 'Giá trị giảm (%)' : 'Giá trị giảm (VNĐ)'}
          name="discountValue"
          rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm' }]}
        >
         <InputNumber
            style={{ width: 235 }}
            min={discountType === 'percentage' ? 1 : 0}
            max={discountType === 'percentage' ? 100 : undefined}
            formatter={value => {
                if (!value) return '';
                if (discountType === 'percentage') {
                return `${value}%`;
                } else {
                const num = Number(value.toString().replace(/,/g, ''));
                if (isNaN(num)) return '';
                return num.toLocaleString('vi-VN'); 
                }
            }}
            parser={value => {
                if (!value) return '';
                if (discountType === 'percentage') {
                return value.replace('%', '');
                } else {
                return value.replace(/[,.\s]/g, '');
                }
            }}
        />

        </Form.Item>
      )}

      <Form.Item
        label="Giá trị đơn hàng được sử dụng "
        name="minOrderValue"
        rules={[
          { type: 'number', min: 0, message: 'Giá trị phải lớn hơn hoặc bằng 0' },
        ]}
      >
        <InputNumber
            style={{ width: 235 }}
            min={0}
            formatter={value => {
                if (!value) return '';
                const num = Number(value.toString().replace(/,/g, ''));
                if (isNaN(num)) return '';
                return num.toLocaleString('vi-VN'); 
                
            }}
            parser={value => {
                if (!value) return '';
                return value.replace(/[,.\s]/g, '');
            }}
        />
      </Form.Item>

      <Form.Item
        label="Số lượng mã giảm giá"
        name="usageLimit"   
     
      >
        <InputComponent type="Number" />
      </Form.Item>
     
     
     <Form.Item
        label="Số lượng mã giảm giá đã dùng"
        name="usageCount"   
        
      >
        <InputComponent disabled />
      </Form.Item>
      
     <Form.Item
        label="Giới hạn số lần mỗi người dùng "
        name="userLimit"   
      >
        <InputComponent type='Number' />
      </Form.Item>

        
    <Form.Item
        label="Ngày bắt đầu"
        name="startDate"
        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
        
    >
        <DatePicker format="DD/MM/YYYY" 
            disabledDate={disabledStartDate}
            onChange={date => setStartDate(date)}
        />
    </Form.Item>

    <Form.Item
        label="Ngày kết thúc"
        name="endDate"
        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
    >
        <DatePicker format="DD/MM/YYYY" 
            disabledDate={disabledEndDate}
            onChange={(date)=> setEndDate(date)}
        />
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
                {mode === 'create' ? 'Thêm mã giảm giá' : 'Cập nhật mã giảm giá'}
            </Button>
        </Form.Item>
    </Form>
  );
};

export default VoucherFormComponent;
