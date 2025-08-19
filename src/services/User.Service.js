import axios from "axios"
import axiosJwt from "./axiosJwt";
import { data } from "react-router-dom";

export const loginUser = async (data) => {
   try {

    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-in`, data);
    return res.data;
    
  } catch (error) {
    const errResponse = error?.response?.data;
    return {
      status: 'ERR',
      message: errResponse?.message 
    };
  }
};


export const signUpUser = async (data) => {
  try {

    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up`, data);
    return res.data;
    
  } catch (error) {
     const errResponse = error?.response?.data;
      return {
      status: 'ERR',
      message: errResponse?.message 
    };
   
  }
};

export const getDetailUser = async (id,access_token) => {

  const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/user/get-detail/${id}`, {
    headers:{
      token:`Bearer ${access_token}`,

    }
  });
  return res.data;

};

export const getAlllUser = async (page,limit,search,access_token) => {

  const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/user/getAll`,{
    params: { page, limit ,search},
    headers:{
      token:`Bearer ${access_token}`,
    }
  });

  return res.data;

};

export const refreshToken=async () => {

  const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`, {},{
     withCredentials: true
  }
  );
  return res.data;

};


export const logoutUser=async () => {

  const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`,{},
    {withCredentials: true}
  )
  ;
  return res.data;

};

export const updateUser=async (id,dataUser,access_token) => {
  
  try {
    const res = await axiosJwt.put(`${process.env.REACT_APP_API_URL}/user/update-user/${id}`,dataUser,{
        headers:{
        token:`Bearer ${access_token}`,
      }
    });
    return res.data;
  } catch (error) {
       const errResponse = error?.response?.data;

       throw new Error(errResponse?.message || 'Lỗi cập nhật người dùng');
  }


};

export const deleteUser= async (id,access_token) =>{
  const res = await axiosJwt.delete(`${process.env.REACT_APP_API_URL}/user/delete-user/${id}`,{
      headers:{
      token:`Bearer ${access_token}`,
    }
  });
  return res.data;
}

export const deleteManyUser= async (data,access_token) =>{
  const res=  await axiosJwt.post(`${process.env.REACT_APP_API_URL}/user/delete-many`,data,{
      headers:{
      token:`Bearer ${access_token}`,
    }
  });

  
  return res.data;
}


export const sendOtp= async (email) =>{
  console.log(email)
  const res=  await axiosJwt.get(`${process.env.REACT_APP_API_URL}/forgot-password/sendOtp/${email}`)
  
  return res.data;
}

export const verifyOtp= async (data) =>{
  const res=  await axiosJwt.post(`${process.env.REACT_APP_API_URL}/forgot-password/verify-otp`,data)

  return res.data;
}

export const resetPassword= async (data,access_token) =>{
  const res=  await axiosJwt.patch(`${process.env.REACT_APP_API_URL}/forgot-password/reset-password/${data.userId}`,data,{
    headers:{
        token:`Bearer ${access_token}`,
    }
  })
  return res.data;
}

export const changePassword= async (userId,access_token,data) =>{
  const res=  await axiosJwt.post(`${process.env.REACT_APP_API_URL}/user/change-password/${userId}`,data,{
      headers:{
      token:`Bearer ${access_token}`,
    }
  });

  
  return res.data;
}
