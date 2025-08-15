
import axiosJwt from "./axiosJwt";

export const update= async (data,access_token) => {

    const res = await axiosJwt.post(`${process.env.REACT_APP_API_URL}/website-info/update`, data,{
      headers:{
      token:`Bearer ${access_token}`,
    }
    });
    return res.data;
    
  
};


export const getInfo= async () => {

    const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/website-info/get-info`,);
    return res.data;
    
  
};
