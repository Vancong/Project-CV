import swal from 'sweetalert';

export const alertSuccess = (title = 'Thành công', message = '') => {
  swal(title, message, 'success');
};

export const alertError = (title = 'Lỗi', message = '') => {
  swal(title, message, 'error');
};

export const alertWarning = (title = 'Cảnh báo', message = '') => {
  swal(title, message, 'warning');
};

export const alertConfirm = async (title, message = '') => {
  return swal({
    title,
    text: message,
    icon: 'warning',
    buttons: ['Hủy', 'Đồng ý'],
    dangerMode: true,
  });
};
