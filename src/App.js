  import React, { Fragment, useEffect, useState } from 'react'
  import {BrowserRouter as Router, Routes,Route, Navigate} from "react-router-dom";
  import { routes } from './routes';
  import DefaultComponent from './components/DefaultComponent/DefaultComponent';
  import{isJsonString} from "./utils/validate";
  import { jwtDecode } from 'jwt-decode';
  import { useDispatch, useSelector } from 'react-redux';
  import { updateUser } from './redux/slices/UserSlice';
  import *as UserService  from "./services/User.Service";
  import LoadingComponent from './components/LoadingComponent/LoadingComponent';


  export function App() { 
    const dispatch=useDispatch();
    const user=useSelector((state =>state.user));
    const [isLoading,setIsLoading]=useState(true);

    useEffect(() => {

      const handlGetUser= async () =>{
          const  {decode,storeData}=handleDecode()|| {};
            try {
              if (decode?.id) {
                await handlGetDetailUser(decode.id, storeData);
              }     
                
            } catch (error) {
              console.log('Lỗi khi lấy user:', error);;
            }
            finally {
              setIsLoading(false); 
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


    UserService.axiosJwt.interceptors.request.use(async (config) => {
      let { decode, storeData } = handleDecode() || {};
      const currentTime = new Date();
      if (decode?.exp < currentTime.getTime() / 1000) {
        try {
          const data = await UserService.refreshToken();
          if (data?.access_token) {
            localStorage.setItem('access_token', JSON.stringify(data.access_token));
            config.headers['token'] = `Bearer ${data.access_token}`;
          }
        } catch (error) {
          console.error( error);
        }
      } else {
        if (storeData) {
          config.headers['token'] = `Bearer ${storeData}`;
        }
      }
        return config;
      },
       (error) => {
        return Promise.reject(error);
      });


    if (isLoading) {
      return <LoadingComponent isPending={true} />;
    }
    
return (

      <div>
            <Router>
              <Routes>
                {
                  routes.length>0&&routes.map(route =>{
                    const Page=route.page 
                    const ischeckAuth=!route.isPrivate || user.isAdmin      
                    const Layout= route.isShowHeader? DefaultComponent: Fragment
                    return (
                      <Route key={route.path} path={route.path} element= {
                        ischeckAuth ? (
                            <Layout>
                              <Page />
                            </Layout>
                        ): (
                            <Navigate to="/" replace />
                        )
                      
                      } />
                    )
                  })
                }      
              </Routes>
            </Router>

      </div>
      
    )
  }