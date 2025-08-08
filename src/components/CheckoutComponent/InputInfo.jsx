import AddressComponent from '../AddressComponent/AddressComponent';
import "./CheckoutComponent.scss"
const InputInfo = ({ formData, setFormData, fullAddress, setFullAddress, errors, setErrors }) => {
  const handleOnChange = (value, type) => {
    setFormData({ ...formData, [type]: value });
    if (errors[type]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[type];
        return newErrors;
      });
    }
  };

  return (
    <div className="checkout_left">
      <h2>Chi tiết thanh toán</h2>
      <input
        type="text"
        placeholder="Nhập họ và tên"
        className={errors.name ? 'input_error' : ''}
        onChange={(e) => handleOnChange(e.target.value, 'name')}
      />
      {errors.name && <div className="error">{errors.name}</div>}

      <input
        type="number"
        placeholder="Nhập số điện thoại"
        className={errors.phone ? 'input_error' : ''}
        onChange={(e) => handleOnChange(e.target.value, 'phone')}
      />
      {errors.phone && <div className="error">{errors.phone}</div>}

      <input
        type="email"
        placeholder="Nhập địa chỉ email (không bắt buộc)"
        className={errors.email ? 'input_error' : ''}
        onChange={(e) => handleOnChange(e.target.value, 'email')}
      />
      {errors.email && <div className="error">{errors.email}</div>}

      <AddressComponent onAddressChange={setFullAddress} />
      {errors.fullAddress && <div className="error">{errors.fullAddress}</div>}

      <input type="text" placeholder="Nhập địa chỉ cụ thể..." 
            onChange={(e) =>
              setFullAddress((prev) => ({
                ...prev,
                detail: e.target.value,
              }))
            }
      />
      <textarea placeholder="Ghi chú về đơn hàng..." rows={3}></textarea>
    </div>
  );
};

export default InputInfo;
