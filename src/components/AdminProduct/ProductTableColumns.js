import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Image, Popconfirm } from 'antd';

export const getProductTableColumns = ({ onDetail, onDelete }) => [

  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Ảnh',
    dataIndex: 'images',
    key: 'images',
    render: (images) => (
      <Image
        src={images?.[0]}
        alt="thumbnail"
        width={60}
        height={60}
        style={{ objectFit: 'cover', borderRadius: 8 }}
      />
    ),
  },
  {
    title: 'Giới tính',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: 'Thương hiệu',
    dataIndex: 'brand',
    key: 'brand',
  },
  {
    title: 'Giá thấp nhất',
    key: 'minPrice',
    render: (_, record) => {
      const priceList = record.sizes.map((size) => size.price)
      const minPrice = Math.min(...priceList);
      return minPrice.toLocaleString() + ' đ';
    },
  },
  {
    title: 'Số lượng còn',
    key: 'totalStock',
    render: (_, record) => {
      const total = record.sizes.reduce((tt, item) => tt + item.countInStock, 0);
      return total;
    },
  },
  {
    title: 'Hành động',
    key: 'actions',
    render: (_, record) => (
        <div style={{fontSize:'20px'}}>
        <EditOutlined  onClick={() => onDetail(record)}
          style={{color:'orange',cursor:'pointer',marginRight:'10px'}}
        />
        <DeleteOutlined onClick={() => onDelete(record)}
          style={{color:'red',cursor:'pointer'}}
        />
      </div>
    ),
  },
];
