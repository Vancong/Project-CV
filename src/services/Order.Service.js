
import axiosJwt from "./axiosJwt";

export const create = async (id,access_token,data) => {
   try {
    const res = await axiosJwt.post(`${process.env.REACT_APP_API_URL}/order/create/${id}`, data,{
      headers:{
      token:`Bearer ${access_token}`,
    }
    });
    return res.data;
    
  } catch (error) {
    const errResponse = error?.response?.data;
    throw new Error(errResponse?.message || 'Lỗi');
  }
};

export const getMyOrder = async (id,access_token,page,limit) => {
  const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/order/my-order/${id}`,{
      params: { page, limit },
      headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
  return res.data;

};

export const getDetail = async (id,access_token,orderCode) => {

  const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/order/my-order/detail/${id}/${orderCode}`,{
      headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
  return res.data;

};

export const changeStatus = async (id,access_token,data) => {
  console.log(data)
  const res = await axiosJwt.patch(`${process.env.REACT_APP_API_URL}/order/my-order/detail/change-status/${id}`
     ,data,{
      headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
  return res.data;

};