import React, { useEffect, useState } from 'react'
import InputFormComponent from '../../components/InputFormComponent/InputFormComponent'
import './ProfilePage.scss'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from "../../services/User.Service"
import { useMutationHook } from '../../hooks/useMutationHook';
import { updateUser } from '../../redux/slices/UserSlice'
import { Button, Upload, Modal } from 'antd';
import { alertSuccess, alertError } from '../../utils/alert';
import { UploadOutlined } from "@ant-design/icons";
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';

const ProfilePage = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avt, setAvt] = useState(user?.avt);
  const [fileList, setFileList] = useState([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avt: user?.avt || null,
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      avt: user?.avt || null,
    });
    setFileList([]);
  }, [user]);

  const handleChange = (newValue, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleChangePassword = (newValue, name) => {
    setPasswordData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleOnchangeAvt = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      setFormData((prev) => ({
        ...prev,
        avt: fileList[0]?.originFileObj,
      }));
      const previewUrl = URL.createObjectURL(fileList[0]?.originFileObj);
      setAvt(previewUrl);
    }
  };

  const validateEmail = (email) => {
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return reg.test(email);
  };

  const mutation = useMutationHook(async ({ id, dataUser, access_token }) => {
    const res = await UserService.updateUser(id, dataUser, access_token);
    dispatch(updateUser({ access_token, ...res.user }));
    return res;
  });

  const { data, isSuccess, isError, isPending, error } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      alertSuccess('Thành Công', 'Cập nhật thành công');
    }
    else if (isError && error?.response?.data == 'ERR') {
      alertError('Thất bại', 'Cập nhật thất bại');
    }
  }, [isError, isSuccess]);

  const handleUpdate = () => {
    if (!formData.email) {
      alertError('Lỗi', 'Email không được để trống');
      return;
    }
    if (!validateEmail(formData.email)) {
      alertError('Lỗi', 'Email không hợp lệ');
      return;
    }

    const dataUser = new FormData();
    dataUser.append('name', formData.name);
    dataUser.append('email', formData.email);
    dataUser.append('phone', formData.phone);
    dataUser.append('address', formData.address);
    if (fileList[0]) {
      dataUser.append('avt', fileList[0].originFileObj);
    }

    mutation.mutate({
      id: user?.id,
      access_token: user?.access_token,
      dataUser
    });
  };

   const mutationChangePassword = useMutationHook(async ({ userId, access_token,data }) => {
    const res = await UserService.changePassword(userId, access_token,data);
    return res;
  });

  const { data:dataChangePassword, isSuccess:isSuccessChangePassword,
     isError:isErrorChangePassword, isPending:isPendingChangePasswrod, 
     error:errorChangePassword } = mutationChangePassword;

  useEffect(() => {
    if (isSuccessChangePassword && dataChangePassword?.status === 'OK') {
      alertSuccess('Thành Công', 'Đổi mật khẩu thành công');
      setIsOpenModal(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
    else if (isErrorChangePassword) {
      console.log(errorChangePassword)
      alertError('Thất bại',`${errorChangePassword?.response?.data?.message}` );
    }
  }, [isErrorChangePassword, isSuccessChangePassword]);


  const handleChangePasswordOk = () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      alertError("Lỗi", "Vui lòng nhập đầy đủ mật khẩu");
      return;
    }

    if (passwordData.oldPassword.length < 6 || passwordData.newPassword.length < 6) {
      alertError("Lỗi", "Vui lòng nhập đủ 6 kí tự");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alertError("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    const data={
      userId: user?.id,
      oldPassword:passwordData.oldPassword,
      newPassword: passwordData.newPassword,
      cfPassword: passwordData.confirmPassword
    }
    mutationChangePassword.mutate({userId: user?.id,access_token:user?.access_token,data})
  };

  return (
    <div className='profile-user'>
      <h1>Thông tin người dùng</h1>
      <LoadingComponent isPending={isPending}>
        <div className='content-profile'>
          <div className='wrapper-input'>
            <label htmlFor='name'>Họ tên </label>
            <InputFormComponent
              id="name"
              style={{ width: '300px' }}
              value={formData.name}
              onChange={(value) => handleChange(value, 'name')}
              placeholder={'Nhập họ tên'}
              name="name"
            />
          </div>

          <div className='wrapper-input'>
            <label htmlFor='email'>Email</label>
            <InputFormComponent
              id="email"
              name="email"
              style={{ width: '300px' }}
              value={formData.email}
              onChange={(value) => handleChange(value, 'email')}
              placeholder={'Nhập email'}
            />
          </div>

          <div className='wrapper-input'>
            <label htmlFor='phone'> Số điện thoại</label>
            <InputFormComponent
              id="phone"
              name="phone"
              type="number"
              style={{ width: '300px' }}
              value={formData.phone}
              onChange={(value) => handleChange(value, 'phone')}
              placeholder={'Nhập số điện thoại'}
            />
          </div>

          <div className='wrapper-input'>
            <label htmlFor='address'> Địa chỉ</label>
            <InputFormComponent
              id="address"
              name="address"
              style={{ width: '300px' }}
              value={formData.address}
              onChange={(value) => handleChange(value, 'address')}
              placeholder={'Nhập địa chỉ'}
            />
          </div>

          <div className='wrapper-input'>
            <label htmlFor='avt'> Ảnh đại diện</label>
            <Upload
              onChange={handleOnchangeAvt}
              accept="image/*"
              multiple={false}
              maxCount={1}
              fileList={fileList}
              showUploadList={false}
              beforeUpload={() => false} >
              <Button icon={<UploadOutlined />} >Tải lên</Button>
            </Upload>
            {avt && (
              <img src={avt} className='img-avt' alt="avt" />
            )}
          </div>


          <Modal
            title="Đổi mật khẩu"
            open={isOpenModal}
            onOk={handleChangePasswordOk}
            onCancel={() => setIsOpenModal(false)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <div className='wrapper-input'>
              <label htmlFor='oldPassword'>Mật khẩu cũ</label>
              <InputFormComponent
                id="oldPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu cũ"
                value={passwordData.oldPassword}
                onChange={(value) => handleChangePassword(value, 'oldPassword')}
              />
            </div>

            <div className='wrapper-input'>
              <label htmlFor='newPassword'>Mật khẩu mới</label>
              <InputFormComponent
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu mới"
                value={passwordData.newPassword}
                onChange={(value) => handleChangePassword(value, 'newPassword')}
              />
            </div>

            <div className='wrapper-input'>
              <label htmlFor='confirmPassword'>Xác nhận mật khẩu</label>
              <InputFormComponent
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu mới"
                value={passwordData.confirmPassword}
                onChange={(value) => handleChangePassword(value, 'confirmPassword')}
              />
            </div>

            <label style={{ display: 'block', marginTop: 10, marginRight: 170, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                style={{ marginRight: 8 }}
              />
              Hiện mật khẩu
            </label>
          </Modal>


          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <ButtonComponent
              onClick={() => setIsOpenModal(true)}
              styleButton={{
                background: '',
                height: '30px',
                width: 'fit-content',
                border: '1px solid rgb(26,148,255)',
                borderRadius: '4px',
              }}
              size={40}
              textButton={'Đổi mật khẩu'}
              styleTextButton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '500' }}
            />

            <ButtonComponent
              disabled={!formData.email}
              onClick={handleUpdate}
              styleButton={{
                background: '',
                height: '30px',
                width: 'fit-content',
                border: '1px solid rgb(26,148,255)',
                borderRadius: '4px',
              }}
              size={40}
              textButton={'Cập nhật'}
              styleTextButton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '500' }}
            />
          </div>
        </div>
      </LoadingComponent>
    </div>
  )
}

export default ProfilePage
