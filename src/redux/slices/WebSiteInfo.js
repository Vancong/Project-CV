import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  phone: '',
  banner: [],
  address: '',
  logo:'',  
  socialLinks:{
    facebook:'',
    tiktok:'',
    zalo:''
  }
}

export const WebSiteInfo = createSlice({
  name: 'websiteInfo',
  initialState,
  reducers: {
    setInfo: (state,action) =>{
      const {name='',email='',phone='',address='',logo='',banner=[],socialLinks}=action.payload
      state.name=name;
      state.phone=phone;
      state.email=email;
      state.logo=logo;
      state.address=address;
      state.banner=banner;
      state.socialLinks = {
        facebook: socialLinks.facebook || '',
        tiktok: socialLinks.tiktok || '',
        zalo: socialLinks.zalo || ''
      }
    }
    
  },
})

export const { setInfo } = WebSiteInfo.actions

export default WebSiteInfo.reducer