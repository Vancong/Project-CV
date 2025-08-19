
import InputFormComponent from '../../components/InputFormComponent/InputFormComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import "./SiginPgae.scss"
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import * as UserService from '../../services/User.Service';
import { useMutationHook } from '../../hooks/useMutationHook'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import { jwtDecode } from 'jwt-decode';
import {useDispatch} from 'react-redux'
import { updateUser } from '../../redux/slices/UserSlice'
import { setCart } from '../../redux/slices/CartSlice'
import *as CartService from "../../services/Cart.Service";
import *as FavoriteService from "../../services/Favorite.Service"
import { setFavoriteIds } from '../../redux/slices/FavoriteSlice'
const SigninPage = () => {
  const [email,setEmail] =useState('');
  const [password,setPasswrod]=useState('');
  const [showPassword, setShowPassword] = useState(false);
  const location=useLocation();
  const dispatch=useDispatch();

  const navigate= useNavigate();
  const handleNavigateSignUp=() =>{
    navigate('/sign-up');
  }


  const mutation=useMutationHook(
      data => UserService.loginUser(data)
  )

  useEffect(() => {
      if (location.state?.email && location.state?.password) {
        mutation.mutate({
          email: location.state.email,
          password: location.state.password
        });
      }
  }, [location.state]);

  const {data,isPending,isSuccess}= mutation;

  useEffect (() => {

    const handleLogin=async () =>{
        if(isSuccess&&data.status==='OK'){
          localStorage.setItem('access_token',JSON.stringify(data?.access_token))
          if(data?.access_token) {
            const decode= jwtDecode(data?.access_token);
            if(decode?.id) {
  
              await handlGetDetailUser(decode.id,data?.access_token)
              await handlDetailCart(decode.id,data?.access_token)
              await handleGetUserFavorites(decode.id,data.access_token)
            }
          }

          if(location.state&&!location.state.email&&location.state.password) {
            navigate(location?.state)
            console.log('stat')
          }
          else {
            console.log('trang chu ss')
            navigate('/')
          }
        }
    }
    handleLogin();

  },[isSuccess])

  
  const handleGetUserFavorites= async(id,access_token) => {
        const res= await FavoriteService.getUserFavorite(id,access_token);
  
        dispatch(setFavoriteIds({total: res.total,productIds: res.data}));
      
  }

  const handlDetailCart = async (id, access_token) => {
    const res = await CartService.getDetail(id, access_token);
    const items = [...res.data||[]];

    dispatch(setCart({ items, total: res?.total||0 }));
  };

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
              onKeyDown={e => {
                if (e.key === 'Enter' && email && password) {
                  handleSignIn();
                }
              }}
          />
          <InputFormComponent 
              className="inputAcccount" 
              placeholder="Mật khẩu"   
              type={showPassword ? 'text' : 'password'}
              value={password} 
              onChange={handleOnchangePassword}  
              onKeyDown={e => {
                if (e.key === 'Enter' && email && password) {
                  handleSignIn();
                }
              }}

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
          <p style={{cursor:'pointer',color:'#0f6ecd'}} onClick={()=> navigate('/forgot-password')}> Quên mật khẩu? </p>
          <p>Bạn chưa có tài khoản. <span style={{cursor:'pointer',color:'#0f6ecd'}} onClick={handleNavigateSignUp}>Đăng ký tại đây.</span> </p>
        </div>

    </div>
  )
}

export default SigninPage