import React, { useEffect, useState } from 'react'
import InputFormComponent from '../../components/InputFormComponent/InputFormComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/User.Service';
import { useMutationHook } from '../../hooks/useMutationHook'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';


const SignUpPage = () => {
  const navigate=useNavigate();
  const handleNavigateSignIn= () =>{
    navigate('/sign-in');
  }
  const [showPassword, setShowPassword] = useState(false);

  const mutation=useMutationHook(
        data => UserService.signUpUser(data)
  )
  const {data,isPending,isSuccess}= mutation;

  useEffect (() => {

    if(isSuccess&&data.status==='OK'){
      handleNavigateSignIn();
    }
  },[isSuccess])
  
  const [email,setEmail] =useState('');
  const [password,setPasswrod]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  
  const handleOnchangeEmail= (value) =>{
    setEmail(value)
  }

  const handleOnchangePassword= (value) =>{
    setPasswrod(value)
  }

  const handleOnchangeConfirmPassword= (value) =>{
    setConfirmPassword(value)
  }

  const handleSignUp = () =>{
    mutation.mutate({email,password,confirmPassword})

  }



  return (
     <div className='siginPage'>
        <div className='page'>
          <h1>Đăng ký tài khoản</h1>
          <p>Nếu bạn đã có tài khoản, đăng nhập <span onClick={handleNavigateSignIn} style={{cursor:'pointer',color:'blue'}}>tại đây</span>.</p>
          <InputFormComponent 
              className="inputAcccount" 
              placeholder="Email" 
              value={email} 
              onChange={handleOnchangeEmail} 
          />
          <InputFormComponent 
              className="inputAcccount" 
              placeholder="Mật khẩu" 
              type={showPassword ? 'text' : 'password'}
              value={password} 
              onChange={handleOnchangePassword}   
          />
          <InputFormComponent 
              className="inputAcccount" 
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu" 
              value={confirmPassword}
              onChange={handleOnchangeConfirmPassword}
          />
           <label style={{ display: 'block', marginTop: 10,marginRight:170, cursor: 'pointer' }}>
              <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              style={{ marginRight: 8 }}
              />
              Hiện mật khẩu
          </label>
          
          {data?.status === "ERR" && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                {data.message}
              </div>
          )}
          <LoadingComponent isPending={isPending}>
            <ButtonComponent
                disabled={!email.length || !password.length || !confirmPassword.length}
                onClick={handleSignUp}
                styleButton={{background: '#0a4f58',fontWeight:'500',lineHeight:'10px',
                            color: '#fff',padding:'17px 10px',border:'none',borderRadius:'4px',
                            fontSize:'15px',width:'170px',margin:'16px 0 10px'

                }}
                textButton={'Đăng ký'}
                      />
          </LoadingComponent>

        </div>

    </div>
  )
}

export default SignUpPage