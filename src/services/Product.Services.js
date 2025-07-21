import axios from "axios";
import { axiosJwt } from "./User.Service";


export const getAllProduct=async (page,limit,search) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`,{
     params: { page, limit ,search}
  });
  return res.data;

};


export const createProduct = async (formData) => {
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getDetailProduct = async (id) =>{
  const res=  await axios.get(`${process.env.REACT_APP_API_URL}/product/detail/${id}`);
  return res.data;
}

export const updateProduct = async (id,access_token,data) =>{
  const res=  await axiosJwt.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`,data,{
      headers:{
      token:`Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data',
    }
  });

  
  return res.data;
}

export const deleteProduct= async (id,access_token) =>{
  const res=  await axiosJwt.delete(`${process.env.REACT_APP_API_URL}/product/delete/${id}`,{
      headers:{
      token:`Bearer ${access_token}`,
    }
  });

  
  return res.data;
}

export const deleteManyProduct= async (data,access_token) =>{
  const res=  await axiosJwt.post(`${process.env.REACT_APP_API_URL}/product/delete-many`,data,{
      headers:{
      token:`Bearer ${access_token}`,
    }
  });

  
  return res.data;
}