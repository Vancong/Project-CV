import axios from "axios"
import axiosJwt from "./axiosJwt";

export const createBrand = async (data,access_token) => {
   try {

    const res = await axiosJwt.post(`${process.env.REACT_APP_API_URL}/brand/create`, data,{
      headers:{
      token:`Bearer ${access_token}`,
    }
    });
    return res.data;
    
  } catch (error) {
    const errResponse = error?.response?.data;
    throw new Error(errResponse?.message || 'Lỗi tạo thương hiệu');
  }
};

export const getDetailBrand = async (id,access_token) => {

  const res = await axios.get(`${process.env.REACT_APP_API_URL}/brand/detail/${id}`);
  return res.data;

};


export const getAllBrand= async (page,limit,search,isAdmin=false) => {

  const res = await axios.get(`${process.env.REACT_APP_API_URL}/brand/get-all`, 
    {
       params: { page, limit ,search,isAdmin}
    });
  return res.data;

};


export const updateBrand=async (id,data,access_token) => {
  console.log(data,id)
  try {
    const res = await axiosJwt.put(`${process.env.REACT_APP_API_URL}/brand/update/${id}`,data,{
        headers:{
        token:`Bearer ${access_token}`,

      }
    });
    return res.data;
  } catch (error) {
       const errResponse = error?.response?.data;
       throw new Error(errResponse?.message || 'Lỗi cập nhật thương hiệu');
  }


};

export const deleteBrand= async (id,access_token) =>{
  const res = await axiosJwt.delete(`${process.env.REACT_APP_API_URL}/brand/delete/${id}`,{
      headers:{
      token:`Bearer ${access_token}`,
    }
  });
  return res.data;
}


export const deleteManyBrand= async (data,access_token) =>{
  const res=  await axiosJwt.post(`${process.env.REACT_APP_API_URL}/brand/delete-many`,data,{
      headers:{
      token:`Bearer ${access_token}`,
    }
  });

  
  return res.data;
}