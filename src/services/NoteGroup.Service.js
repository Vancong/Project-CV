import axios from "axios"
import axiosJwt from "./axiosJwt";

export const createNoteGroup = async (data,access_token) => {
    console.log(data,access_token)
   try {
    const res = await axiosJwt.post(`${process.env.REACT_APP_API_URL}/note-group/create`, data,{
      headers:{
      token:`Bearer ${access_token}`,
    }
    });
    return res.data;
    
  } catch (error) {
    const errResponse = error?.response?.data;
    throw new Error(errResponse?.message || 'Lỗi tạo note hương');
  }
};

export const getAllNoteGroup= async (page,limit,search) => {

  const res = await axios.get(`${process.env.REACT_APP_API_URL}/note-group/get-all`, 
    {
       params: { page, limit ,search}
    });
  return res.data;

};


export const getDetailNoteGroup= async (id) => {

  const res = await axios.get(`${process.env.REACT_APP_API_URL}/note-group/detail/${id}`);
  return res.data;

};


export const updateNoteGroup=async (id,data,access_token) => {
  try {
    console.log(id,data,access_token)
    const res = await axiosJwt.put(`${process.env.REACT_APP_API_URL}/note-group/update/${id}`,data,{
        headers:{
        token:`Bearer ${access_token}`,

      }
    });
    return res.data;
  } catch (error) {
       const errResponse = error?.response?.data;
       throw new Error(errResponse?.message || 'Lỗi cập nhật ');
  }


};

export const deleteNoteGroup= async (id,access_token) =>{
  const res = await axiosJwt.delete(`${process.env.REACT_APP_API_URL}/note-group/delete/${id}`,{
      headers:{
      token:`Bearer ${access_token}`,
    }
  });
  return res.data;
}