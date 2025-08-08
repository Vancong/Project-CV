import React from 'react';
import "./ProductTabsComponent.scss"
import { Tabs } from 'antd';
const { TabPane } = Tabs;

const ProductTabsComponent = ({product}) => {

  const { brand, gender, notes, description, concentration, scentDuration } = product;
  const GENDER_LABELS = {
    'Male': 'Nam',
    'Female':'Nữ',
    'Unisex': 'Unisex', 
  };
  return (
    <div style={{ marginTop: 20 }}>
      <Tabs defaultActiveKey="1">
        <TabPane className='tab_title' tab="Chi tiết sản phẩm" key="1">
            <div className='product-tab-content'>
                <p>Hãng: {brand?.name}</p>
                <p>Giới tính: {GENDER_LABELS[gender]}</p>
                <p>Độ tuổi khuyên dùng: Trên 20</p>
                <p>Nồng độ: {concentration}</p>
                <p>Độ lưu hương: {scentDuration}</p>
                <p>Độ toả hương: Trung bình – Toả hương trong bán kính 1m</p>
                <p>Thời điểm khuyên dùng: Ngày, Đêm, Xuân, Thu, Đông</p>
                <p>Hương đầu: {notes?.top?.map(note => note.name).join(', ')}</p>
                <p>Hương giữa: {notes?.middle?.map(note => note.name).join(', ')}</p>
                <p>Hương cuối: {notes?.base?.map(note => note.name).join(', ')}</p>
                <p>{description||''}</p>
            </div>
        </TabPane>

        <TabPane className='tab_title'  tab="Sử dụng" key="2">
            <div className='product-tab-content'>
                <p>- Xịt lên các vùng da có mạch đập như cổ tay, cổ, sau tai để hương thơm lan toả tốt hơn.</p>
                <p>- Không xịt trực tiếp lên quần áo trắng vì có thể gây ố vàng.</p>
           </div>
        </TabPane>

        <TabPane className='tab_title'  tab="Vận chuyển và đổi trả" key="3">
             <div className='product-tab-content'>
                <p>- Giao hàng toàn quốc 1–3 ngày làm việc.</p>
                <p>- Đổi trả trong vòng 7 ngày nếu sản phẩm lỗi/hư hỏng.</p>
            </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProductTabsComponent;
