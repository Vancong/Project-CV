
import InputFormComponent from '../../components/InputFormComponent/InputFormComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import "./SiginPgae.scss"
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import * as UserService from '../../services/User.Service';
import { useMutationHook } from '../../hooks/useMutationHook'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import { jwtDecode } from 'jwt-decode';
import {useDispatch} from 'react-redux'
import { updateUser } from '../../redux/slices/UserSlice'
const SigninPage = () => {
  const [email,setEmail] =useState('');
  const [password,setPasswrod]=useState('');
  const dispatch=useDispatch();

  const navigate= useNavigate();
  const handleNavigateSignUp=() =>{
    navigate('/sign-up');
  }

  const mutation=useMutationHook(
      data => UserService.loginUser(data)
  )

  const {data,isPending,isSuccess}= mutation;

  useEffect (() => {
    if(isSuccess&&data.status==='OK'){
      localStorage.setItem('access_token',JSON.stringify(data?.access_token))
      if(data?.access_token) {
        const decode= jwtDecode(data?.access_token);
        if(decode?.id) {
          handlGetDetailUser(decode.id,data?.access_token)
        }
      }
      navigate('/')
    }
  },[isSuccess])

  const handlGetDetailUser= async (id,access_token) =>{
    const res= await UserService.getDetailUser(id,access_token);

    dispatch(updateUser({access_token,...res?.data})) 
  }


  const handleOnchangeEmail= (value) =>{
    setEmail(value)
  }

  const handleOnchangePassword= (value) =>{
    setPasswrod(value)
  }

  const handleSignIn= () =>{
    mutation.mutate({
      email,
      password
    })

  }

  return (
    <div className='siginPage'>
        <div className='page'>
          <h1>Đăng nhập tài khoản</h1>
          <p>Nếu bạn đã có tài khoản, đăng nhập tại đây.</p>
          <InputFormComponent 
              className="inputAcccount" 
              placeholder="Email"  
              value={email} 
              onChange={handleOnchangeEmail} 
          />
          <InputFormComponent 
              className="inputAcccount" 
              placeholder="Mật khẩu"   
              value={password} 
              onChange={handleOnchangePassword}   
          />
          {data?.status === 'ERR' && (
            <div style={{ color: 'red', marginTop: '10px' }}>
                {data.message}
            </div>
          )}
          <LoadingComponent isPending={isPending}>
            <ButtonComponent
                disabled={!email.length || !password.length}
                onClick={handleSignIn}
                styleButton={{background: '#0a4f58',fontWeight:'500',lineHeight:'10px',
                            color: '#fff',padding:'17px 10px',border:'none',borderRadius:'4px',
                            fontSize:'15px',width:'170px',margin:'16px 0 10px'

                }}
                textButton={'Đăng nhập'}
                                    
            />
          </LoadingComponent>
          <p> Quên mật khẩu? </p>
          <p>Bạn chưa có tài khoản. <span style={{cursor:'pointer'}} onClick={handleNavigateSignUp}>Đăng ký tại đây.</span> </p>
        </div>

    </div>
  )
}

export default SigninPage