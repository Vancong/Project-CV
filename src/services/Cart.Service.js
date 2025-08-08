
import axiosJwt from "./axiosJwt";


export const create = async (id,access_token,data) => {
   try {
    const res = await axiosJwt.post(`${process.env.REACT_APP_API_URL}/cart/create/${id}`, data,{
      headers:{
      token:`Bearer ${access_token}`,
    }
    });
    return res.data;
    
  } catch (error) {
    const errResponse = error?.response?.data;
    throw new Error(errResponse?.message || 'Lỗi giỏ hàng');
  }
};


export const getDetail = async (id,access_token) => {

  const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/cart/detail/${id}`,{
      headers: {
      token: `Bearer ${access_token}`
    }
  });
  return res.data;

};

export const decreaseQuantity = async (id,access_token,data) => {

  const res = await axiosJwt.patch(`${process.env.REACT_APP_API_URL}/cart/decrease/${id}`,data,{
      headers: {
      token: `Bearer ${access_token}`
    }
  });
  return res.data;

};


export const deleteProductInCart = async (id,access_token,data) => {
 

  const res = await axiosJwt.patch(`${process.env.REACT_APP_API_URL}/cart/delete-product/${id}`,data,{
      headers: {
      token: `Bearer ${access_token}`
    }
  });
  return res.data;

};


export const increaseQuantity = async (id,access_token,data) => {
  const res = await axiosJwt.patch(`${process.env.REACT_APP_API_URL}/cart/increase/${id}`,data,{
      headers: {
      token: `Bearer ${access_token}`
    }
  });
  return res.data;

};


export const clearCart = async (id,access_token) => {
  const res = await axiosJwt.patch(`${process.env.REACT_APP_API_URL}/cart/clear-cart/${id}`,{
      headers: {
      token: `Bearer ${access_token}`
    }
  });
  return res.data;

};