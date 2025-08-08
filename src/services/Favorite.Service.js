
import axiosJwt from "./axiosJwt";

export const toggle = async (data,access_token) => {
   try {
    const res = await axiosJwt.post(`${process.env.REACT_APP_API_URL}/favorite/toggle/${data.userId}`, data,{
      headers:{
      token:`Bearer ${access_token}`,
    }
    });
    return res.data;
    
  } catch (error) {
    const errResponse = error?.response?.data;
    throw new Error(errResponse?.message || 'Lỗi ');
  }
};


export const getUserFavorite = async (userId,access_token) => {
  const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/favorite/getUserFavorite/${userId}`,{
      headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
  return res.data;

};

export const decreaseQuantity = async (data,access_token) => {
  const res = await axiosJwt.patch(`${process.env.REACT_APP_API_URL}/cart/decrease`,data,{
      headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
  return res.data;

};


export const deleteProductInCart = async (data,access_token) => {

  const res = await axiosJwt.patch(`${process.env.REACT_APP_API_URL}/cart/delete-product`,data,{
      headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
  return res.data;

};


export const increaseQuantity = async (data,access_token) => {
  const res = await axiosJwt.patch(`${process.env.REACT_APP_API_URL}/cart/increase`,data,{
      headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
  return res.data;

};


