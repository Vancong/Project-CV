export const getStatusLabel = (status) => {
  const labels = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    completed: "Giao hàng thành công",
    cancelled: "Đã hủy",
    refunded: "Đã hoàn tiền",
    refund_pending: "Đang hoàn tiền"
  };
  return labels[status] || status;
};
