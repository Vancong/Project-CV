
import axiosJwt from "./axiosJwt";

export const create= async (data,access_token) => {
   try {
    console.log(data)
    const res = await axiosJwt.post(`${process.env.REACT_APP_API_URL}/voucher/create`, data,{
      headers:{
      token:`Bearer ${access_token}`,
    }
    });
    return res.data;
    
  } catch (error) {
    const errResponse = error?.response?.data;
    throw new Error(errResponse?.message || 'Lỗi tạo voucher');
  }
};

export const getAll = async ({userId,page,limit,search,access_token}) => {

  const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/voucher/getAll/${userId}`,{
    params: { page, limit ,search},
    headers:{
      token:`Bearer ${access_token}`,
    }
  });
  return res.data;
}

export const update = async (id,data,access_token) => {

  const res = await axiosJwt.patch(`${process.env.REACT_APP_API_URL}/voucher/update/${id}`,data,{
    headers:{
      token:`Bearer ${access_token}`,
    }
  });
  return res.data;
}

export const deleteVoucher= async (id,access_token) => {

  const res = await axiosJwt.delete(`${process.env.REACT_APP_API_URL}/voucher/delete/${id}`,{
    headers:{
      token:`Bearer ${access_token}`,
    }
  });
  return res.data;
}

export const deleteMany= async (ids,access_token) => {

  const res = await axiosJwt.post(`${process.env.REACT_APP_API_URL}/voucher/delete-many`,ids,{
    headers:{
      token:`Bearer ${access_token}`,
    }
  });
  return res.data;
}

export const check= async (data,userId,access_token) => {

  const res = await axiosJwt.post(`${process.env.REACT_APP_API_URL}/voucher/check/${userId}`,data,{
    headers:{
      token:`Bearer ${access_token}`,
    }
  });
  return res.data;
}