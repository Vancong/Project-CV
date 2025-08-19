import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  access_token: '',
  phone: '',
  address: '',
  avt:'',  
  id: '',
  isAdmin: '',
}

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state,action) =>{

      const {name='',email='' ,access_token='',phone='',avt='',address='',_id='',isAdmin}=action.payload
      state.name=name;
      state.id=_id;
      state.email=email;
      state.access_token=access_token;
      state.avt=avt;
      state.address=address;
      state.phone=phone;
      state.isAdmin=isAdmin;
    },
    resetUser: (state) =>{
      state.id='';
      state.name='';
      state.email='';
      state.access_token='';
      state.avt='';
      state.address='';
      state.phone='';
      state.isAdmin=false;
    },
    
  },
})

export const { updateUser,resetUser } = UserSlice.actions

export default UserSlice.reducer