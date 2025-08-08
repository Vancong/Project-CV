import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./NavigationPathComponent.scss"

const NavigationPathComponent = ({ category='', slugCt='', product='' }) => {
  const navigate = useNavigate();
  const {type}=useParams();
  const categoryMap = {
    'nuoc-hoa-nam': 'Nước hoa nam',
    'nuoc-hoa-nu': 'Nước hoa nữ',
    'nuoc-hoa-unisex': 'Nước hoa Unisex',
    'note-huong': 'Note ',
    'thuong-hieu': 'Thương hiệu',
    'deal-thom': 'Deal thơm'
  };
  const categoryName = category || categoryMap[type];

  return (
   <div className="navigation_path">
      <span onClick={() => navigate('/')}>Trang chủ</span>
      {categoryName && (
        <>
          <span> / </span>
          <span
            onClick={() => slugCt && navigate(slugCt)}
            className={!product ? 'active' : ''}
          >
            {categoryName}
          </span>
        </>
      )}
      {product && (
        <>
          <span> / </span>
          <span className="active">{product}</span>
        </>
      )}
    </div>
  );
};

export default NavigationPathComponent;
