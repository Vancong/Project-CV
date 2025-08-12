import React, { useState, useEffect } from 'react';
import InputFormComponent from '../../components/InputFormComponent/InputFormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import * as UserService from '../../services/User.Service';
import { useMutationHook } from '../../hooks/useMutationHook';
import './ForgotPasswordPage.scss'
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [canSend, setCanSend] = useState(true); 
  const [timer, setTimer] = useState(0);
  const navigate=useNavigate();

    const sendOtpMutation = useMutationHook(async (email) => {
        return await  UserService.sendOtp(email)
    });

   const verifyOtpMutation = useMutationHook(async (data) => {
        return await  UserService.verifyOtp(data)
    });

    const {data: dataVeri,isPending:isPendingVery,isSuccess:isSuccessVery} =verifyOtpMutation;
    console.log(verifyOtpMutation)
    useEffect(()=>{
        if(dataVeri?.status==='OK'){
            const access_token=dataVeri.access_token;
            const userId=dataVeri.userId
            sessionStorage.setItem('userId', userId);
            sessionStorage.setItem('access_token', access_token);
            navigate('/reset-password', { state: { userId,access_token } });
        }
    },[dataVeri,isSuccessVery,dataVeri])


  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      setCanSend(true);
    }
    return () => clearTimeout(interval);
  }, [timer]);

  const handleSendOtp = () => {
    if (!email) return;
    sendOtpMutation.mutate(email );
    setCanSend(false);
    setTimer(60);
  };

  const handleVerifyOtp = () => {
    if (!email || !otp) return;
    const data={
        email,
        otp
    }
    verifyOtpMutation.mutate(data);
  };



  return (
    <div className='container forgot_password_page'>
      <h2>Quên mật khẩu</h2>

      <div className='info' >
        <InputFormComponent
          placeholder="Nhập email"
          value={email}
          onChange={setEmail}
          style={{ flex: 1 }}
        />
        <ButtonComponent
          disabled={!canSend || !email}
          onClick={handleSendOtp}
          textButton={canSend ? 'Gửi mã' : `Gửi lại (${timer}s)`}
          styleButton={{ padding: '10px 16px', minWidth: 100 }}
        />
      </div>
      {sendOtpMutation.isPending && <p>Đang gửi mã...</p>}

      <div style={{ marginBottom: 20 }}>
        <InputFormComponent
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={setOtp}
          type="Number"
          onKeyDown={e => {
            if (e.key === 'Enter' && email && otp) {
            handleVerifyOtp();
            }
         }}
        />
      </div>
      {verifyOtpMutation?.error?.response.data.status === 'ERR' && (
        <p style={{ color: 'red' }}>{verifyOtpMutation.error.response.data.message}</p>
      )}
      {verifyOtpMutation.isPending && <p>Đang xác nhận mã OTP...</p>}

      <ButtonComponent
        disabled={!email || !otp}
        onClick={handleVerifyOtp}
        textButton="Xác nhận"
        styleButton={{ width: '100%', padding: '12px' }}
      />
    </div>
  );
};

export default ForgotPasswordPage;
