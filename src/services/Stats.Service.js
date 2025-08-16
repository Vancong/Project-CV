import axiosJwt from "./axiosJwt";

export const revenue = async (data,access_token) => {

    const res = await axiosJwt.get(`${process.env.REACT_APP_API_URL}/stats/revenue`,{
        params: data,
        headers:{
            token:`Bearer ${access_token}`,

        }
    });
    return res.data;

};
