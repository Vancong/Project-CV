import axios from "axios";
import axiosJwt from "./axiosJwt";


export const getAllProduct=async ({page=1,limit=10,search='',filters}) => {

  const params={page,limit,search};
  if (filters?.gender) params.gender = filters.gender;
  if (filters?.price) {
    if (filters.price === '< 1.5 Triệu') {
      params.price_lt = 1500000;
    } else if (filters.price === '1.5 Triệu - 3 Triệu') {
      params.price_gte = 1500000;
      params.price_lte = 3000000;
    } else if (filters.price === '> 3 Triệu') {
      params.price_gt = 3000000;
    }
  }
  if (filters?.brands && filters?.brands?.length > 0) {
    params.brands = filters.brands.join(',');
  }

  if (filters?.notes && filters?.notes?.length > 0) {
    params.notes = filters.notes.join(',');
  }

  const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`,{params});
  return res.data;

};


export const createProduct = async (data,access_token) => {
  try {
    const res = await axiosJwt.post(`${process.env.REACT_APP_API_URL}/product/create`, data, {
    headers: {
       token:`Bearer ${access_token}`,
    },
    });
    return res.data;
  } catch (error) {
    console.log(error)
    const errResponse = error?.response?.data;
    throw new Error(errResponse?.message || 'Lỗi tạo  sản phẩm');
  }
 
};

export const getDetailProduct = async (id) =>{

  const res=  await axios.get(`${process.env.REACT_APP_API_URL}/product/detail/${id}`,{
      headers: {
        'Cache-Control': 'no-cache'
      }
  });
  return res.data;
}

export const updateProduct = async (id,access_token,data) =>{
  console.log(access_token)
 try {
    const res=  await axiosJwt.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`,data,{
      headers:{
      token:`Bearer ${access_token}`,
    }
    });
    return res.data
 } catch (error) {
    const errResponse = error?.response?.data;
    throw new Error(errResponse?.message || 'Lỗi cập nhật sản phẩm');
 }
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