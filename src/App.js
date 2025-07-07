import React, { Fragment, useEffect } from 'react'
import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import { routes } from './routes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import{isJsonString} from "./utils/validate";
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from './redux/slices/UserSlice';
import *as UserService  from "./services/User.Service";


export function App() { 
  const dispatch=useDispatch();
  useEffect(() => {
    const handlGetUser= async () =>{
        const  {decode,storeData}=handleDecode()|| {};
          try {
            if (decode?.id) {
              await handlGetDetailUser(decode.id, storeData);
            }   
          } catch (error) {
             console.log('Lỗi khi lấy user:', error);
          }      
    }
    handlGetUser();

  },[])

  const handleDecode=  ()  =>{
    let storeData=localStorage.getItem('access_token')
    let decode ={};
    if(storeData && isJsonString(storeData)) {
      storeData=JSON.parse(storeData);
      try {
        decode = jwtDecode(storeData);
      } 
      catch (err) {
        console.log('Token không hợp lệ hoặc hết hạn:', err);
      }
      return {decode,storeData};
    }
  }

  const handlGetDetailUser= async (id,access_token) =>{
    const res= await UserService.getDetailUser(id,access_token);
    dispatch(updateUser({...res?.data ,access_token}))
  }

  
  UserService.axiosJwt.interceptors.request.use(async (config)=>{
    const  {decode}=handleDecode();
    const currentTime=new Date();
    if(decode?.exp<currentTime.getTime()/1000) {
      const data=await UserService.refreshToken();
      config.headers['token']=`Beaer ${data?.access_token}`
    }
    return config ;
  },(err)=>{
    return Promise.reject(err)
  })
  
  
  return (
    <div>
        <Router>
          <Routes>
            {
              routes.length>0&&routes.map(route =>{
                const Page=route.page 
                const Layout= route.isShowHeader? DefaultComponent: Fragment
                return (
                  <Route key={route.path} path={route.path} element= {
                    <Layout>
                      <Page />
                    </Layout>
                  } />
                )
              })
            }
            

            
          </Routes>
        </Router>
    </div>
  )
}