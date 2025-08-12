import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InputFormComponent from '../../components/InputFormComponent/InputFormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import * as UserService from '../../services/User.Service';
import { useMutationHook } from '../../hooks/useMutationHook';
import './ResetPasswordPage.scss';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const userId = location.state?.userId || sessionStorage.getItem('userId');
  const access_token = location.state?.access_token || sessionStorage.getItem('access_token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const mutation = useMutationHook(async (data) => {
    return await UserService.resetPassword(data, access_token);
  });

  const {data,isSuccess,isPending}=mutation;

  const handleResetPassword = () => {
    if (!password || !confirmPassword) {
      setErrorMessage('Vui lòng nhập đầy đủ mật khẩu')
      return;
    }
    if (password.length < 6) {
        setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự');
        return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp')
      return;
    }
    if (!userId) {
      return;
    }

    mutation.mutate({ userId, password });
  };

  useEffect(() => {
    if (data?.status === 'ERR') {
        setErrorMessage(data.message);
    } else {
        setErrorMessage('');
    }
    }, [data]);


  useEffect(() => {
    if (data?.status === 'OK'&&isSuccess) {
      navigate('/sign-in', { state: { email: data.data.email, password :data.data.password} });
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('userId');
    }

   }, [data,isSuccess]);

  return (
    <div className="container reset_password_page">
      <h2>Đặt lại mật khẩu mới</h2>

      <InputFormComponent
        placeholder="Nhập mật khẩu mới"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={setPassword}
      />
      <InputFormComponent
        placeholder="Xác nhận mật khẩu mới"
        type={showPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={setConfirmPassword}
      />
      
        <label style={{ display: 'block', marginTop: 10, cursor: 'pointer' }}>
            <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            style={{ marginRight: 8 }}
            />
            Hiện mật khẩu
      </label>

        {errorMessage && (
            <div style={{ color: 'red', marginTop: '10px' }}>
                {errorMessage}
            </div>
        )}
      <LoadingComponent isPending={isPending}>
        <ButtonComponent
          onClick={handleResetPassword}
          disabled={!password || !confirmPassword}
          textButton="Xác nhận"
          styleButton={{ width: '100%', padding: '12px', marginTop: '16px' }}
        />
      </LoadingComponent>
    </div>
  );
};

export default ResetPasswordPage;
