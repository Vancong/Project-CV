import { Table, Image, Button, InputNumber } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Fomater } from '../../utils/fomater';
import *as CartService from "../../services/Cart.Service";
import { increaseQuantity,decreaseQuantity,removeCart } from '../../redux/slices/CartSlice';
import "./CartTableComponent.scss"
import { useDispatch, useSelector } from 'react-redux';
const CartTableComponent = ({ cartItems, onIncrease, onDecrease, onRemove }) => {
    const dispatch=useDispatch();
    const user=useSelector((state)=> state.user)
    const handleIncrease = async (productId, volume) => {
      const data={
        productId,
        volume,
        userId: user?.id
      }
      await CartService.increaseQuantity(user?.id,user?.access_token,data);
      dispatch(increaseQuantity({productId,volume}));
    };
  
    const handleDecrease =async (productId, volume) => {
       const items = cartItems.find((item) => item.product._id === productId && item.volume === volume);
       if(items.quantity<=1) {
          handleRemove(productId,volume);
          return;
       }
       const data={
        productId,
        volume,
        userId: user?.id
      }
      await CartService.decreaseQuantity(user?.id,user?.access_token,data);
      dispatch(decreaseQuantity({productId,volume}));
    };
  
    const handleRemove =async (productId, volume) => {
       const data={
        productId,
        volume,
        userId: user?.id
      }
      console.log(user)
      await CartService.deleteProductInCart(user?.id, user?.access_token,data);
      dispatch(removeCart({ productId, volume }));
    };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image src={record.product.images[0]} width={60} height={60} />
          <div>
            <div className='title_product_cart'>{record.product.name}-{record.volume}ml</div>
            <div className='btn_delete_cart' onClick={() => handleRemove(record.product._id,record.volume)}> 
                <DeleteOutlined />
                <span style={{paddingLeft:8}}>Xóa</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
         <span className="price_cart">{Fomater(price)}</span>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) => (
         <div className='controls'>
              <span className='button_quantity' 
                        onClick={() => handleDecrease(record.product._id, record.volume)}>
                        -
                </span>
                <span>{record.quantity}</span>
                <span className='button_quantity' 
                    onClick={() => handleIncrease(record.product._id, record.volume)}>
                        +
                </span>  

         </div>
      )
    },
    {
      title: 'Tổng',
      key: 'total',
      render: (_, record) =>(
          <span className="total_cart">{Fomater(record.quantity * record.price)}</span>
      )
    }
    
  ];

  return (
    <Table
      columns={columns}
      dataSource={cartItems}
      rowKey={(record) => record.product._id + '-' + record.volume}
      pagination={false}
    />
  );
};

export default CartTableComponent;
