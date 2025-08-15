import { Modal, Table, Descriptions, Select, message } from "antd";
import { useState, useEffect } from "react";
import { getStatusLabel } from "../../utils/orderStatus";
import { useMutationHook } from "../../hooks/useMutationHook";
import { useSelector } from "react-redux";
import *as OrderService from "../../services/Order.Service"
import { alertError, alertSuccess } from "../../utils/alert";
import { useQueryClient } from "@tanstack/react-query";
const OrderDetailModal = ({ isModalOpen, orderDetail,setIsModalOpen }) => {
  const [order, setOrder] = useState(orderDetail);
  const queryClient=useQueryClient();
  const user=useSelector((state)=>state.user)
  useEffect(() => {
    setOrder(orderDetail); 
  }, [orderDetail]);

  const statusOptions = {
    pending: [{ label: "Đã xác nhận", value: "confirmed" },{ label: "Đã hủy", value: "cancelled" }],
    confirmed: [{ label: "Đang giao", value: "shipping" },{ label: "Đã hủy", value: "cancelled" }],
    shipping: [{ label: "Giao hàng thành công", value: "completed" }],
    completed: [],
    cancelled: [],
    refund_pending: [{label: "Đã hoàn tiền", value: "refunded" }],
    refunded: []
};

   const mutationUpdate= useMutationHook (async ({data,access_token})=>{
        return await OrderService.updateStatus(data,access_token)
    })

    const {isPending,isSuccess,error,isError,data}=mutationUpdate;

    useEffect(()=>{
      if(data?.status==='OK'&&isSuccess) {
        alertSuccess("Cập nhật trạng thái thành công");
        setIsModalOpen(false)
        queryClient.invalidateQueries(['order-all'])
      }
      else if(isError) {
        alertError(`${error?.message}`)
      }
    },[isError,isSuccess,data])

  const handleStatusChange = async (value) => {
      if(!value) return;
      const data={
        status:value,
        orderCode:orderDetail.orderCode,
        updatedBy: user?.name||user?.email
      }
      mutationUpdate.mutate({data,access_token:user?.access_token});
  };

  return (
    <Modal
      title="Chi tiết đơn hàng"
      footer={null}
      open={isModalOpen}
      onCancel={()=>setIsModalOpen(false)}
      width={800}
    >
      {order ? (
        <>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Mã đơn">{order.orderCode}</Descriptions.Item>
            <Descriptions.Item label="Khách hàng">{order.name}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{order.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{order.email}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {`${order.address.detail||''} ${order.address.ward}, ${order.address.district}, ${order.address.province}`}
            </Descriptions.Item>
            <Descriptions.Item label="Thanh toán">{order.paymentMethod}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Select
                value={{ value: order.status, label: getStatusLabel(order.status) }}
                style={{ width: 200 }}
                onChange={handleStatusChange}
                loading={isPending}
                options={statusOptions[order.status]}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              {order.finalPrice.toLocaleString()} đ
            </Descriptions.Item>
          </Descriptions>

          <h4 style={{ marginTop: 16 }}>Sản phẩm</h4>
          <Table
            dataSource={order.items.map((item, index) => ({
              key: index,
              name: item?.product?.name,
              volume: item.volume,
              quantity: item.quantity,
              price: item.price.toLocaleString() + " đ",
              total: (item.quantity * item.price).toLocaleString() + " đ",
            }))}
            columns={[
              { title: "Tên sản phẩm", dataIndex: "name" },
              { title: "Dung tích", dataIndex: "volume" },
              { title: "Số lượng", dataIndex: "quantity" },
              { title: "Giá", dataIndex: "price" },
              { title: "Thành tiền", dataIndex: "total" },
            ]}
            pagination={false}
            size="small"
          />
        </>
      ) : (
        <p>Không có dữ liệu đơn hàng</p>
      )}
    </Modal>
  );
};

export default OrderDetailModal;