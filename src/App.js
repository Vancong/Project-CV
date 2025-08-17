  import React, { Fragment, useEffect, useState } from 'react'
  import {BrowserRouter as Router, Routes,Route, Navigate, data} from "react-router-dom";
  import { routes } from './routes';
  import DefaultComponent from './components/DefaultComponent/DefaultComponent';
  import { jwtDecode } from 'jwt-decode';
  import { useDispatch, useSelector } from 'react-redux';
  import { updateUser } from './redux/slices/UserSlice';
  import *as UserService  from "./services/User.Service";
  import LoadingComponent from './components/LoadingComponent/LoadingComponent';
  import *as CartService from './services/Cart.Service';
  import { setCart } from './redux/slices/CartSlice'; 
  import { setFavoriteIds } from './redux/slices/FavoriteSlice';
  import *as FavoriteService from "./services/Favorite.Service.js";
  import ScrollToTop  from "./components/ScrollToTop/ScrollToTop.jsx"
  import *as WebSiteInfoService from "./services/websiteInfo.Service.js";
  import { setInfo } from './redux/slices/WebSiteInfo.js';
  export function App() { 
    const dispatch=useDispatch();
    const user=useSelector((state =>state.user));
    const [isLoading,setIsLoading]=useState(true);
    useEffect(() => {
      handlDetailInfoWebSite()
      const handlGetUserAndCart= async () =>{
          const  {decode,storeData}=handleDecode()|| {};
            try {
              if (decode?.id) {
                await handlGetDetailUser(decode.id, storeData);
                await  handlDetailCart(decode.id, storeData);
                await handleGetUserFavorites(decode.id,storeData)
              }     
                
            } catch (error) {
              console.log('Lỗi khi lấy user:', error);;
            }
            finally {
              setIsLoading(false); 
            }

      }
      handlGetUserAndCart()


    },[])

    const handlDetailCart= async(id,access_token) =>{
      const res= await CartService.getDetail(id,access_token);
      const items=[...res.data];
      dispatch(setCart({items,total:res.total}))
    }

    const handlDetailInfoWebSite= async() =>{
      const res= await WebSiteInfoService.getInfo();
      dispatch(setInfo(res.data))
    }
    
    
  const handleGetUserFavorites = async (id, access_token) => {
    const res = await FavoriteService.getUserFavorite(id, access_token);
    const listId = res.data.filter(item => item?._id).map(item => item._id);
    dispatch(setFavoriteIds({ total: res?.total || 0, productIds: listId }));
  };

    const handleDecode = () => {
      let storeData = localStorage.getItem('access_token');
      if (!storeData) return {};
      try {
        const decode = jwtDecode(storeData);
        return { decode, storeData };
      } catch (err) {
        console.log('Token không hợp lệ hoặc hết hạn:', err);
        return {};
      }
    };

    const handlGetDetailUser= async (id,access_token) =>{
      const res= await UserService.getDetailUser(id,access_token);
      dispatch(updateUser({...res?.data ,access_token}))

    }



    if (isLoading) {
      return <LoadingComponent isPending={true} />;
    }
    
return (

      <div>
            <Router>
              <ScrollToTop />
              <Routes>
                {
                  routes.length>0&&routes.map(route =>{
                    const Page=route.page      
                    const Layout= route.isShowHeader? DefaultComponent: Fragment
                    const isUserLoggedIn = Boolean(user?.access_token);
                    const isUserAdmin = Boolean(user?.isAdmin);

                    let ischeckAuth = true;
                    if (route.isPrivate && !isUserLoggedIn) {
                      ischeckAuth = false;
                    }
                    
                    if (route.isAdminOnly && !isUserAdmin) {
                        ischeckAuth = false; 
                    }
                    return (
                      <Route key={route.path} path={route.path} element= {
                        ischeckAuth ? (
                            <Layout>
                              <Page />
                            </Layout>
                        ): (
                            <Navigate to="/" state={route.path} replace />
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