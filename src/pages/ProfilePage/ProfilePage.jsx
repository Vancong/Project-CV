import React, { useEffect, useState } from 'react'
import InputFormComponent from '../../components/InputFormComponent/InputFormComponent'
import './ProfilePage.scss'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from "../../services/User.Service"
import { useMutationHook } from '../../hooks/useMutationHook';
import { updateUser } from '../../redux/slices/UserSlice'
import { Button, Upload } from 'antd';
import {UploadOutlined} from "@ant-design/icons";
import { getBase64 } from '../../utils/getBase64';
const ProfilePage = () => {
  const user=useSelector(state =>state.user)
  const [email,setEmail]=useState('');
  const [name,setName]=useState('');
  const [phone,setPhone]=useState('');
  const [address,setAddress]=useState('');
  const [avt,setAvt]=useState(user?.avt);
  const dispatch=useDispatch();

  const mutation=useMutationHook (async (data) =>{
    const {id,access_token, ...rests}=data;
     const res=await UserService.updateUser(id,rests ,access_token);
     dispatch(updateUser({access_token,...res.user})); 
  }
  )
const {data}=mutation;

  useEffect( ()=>{
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvt(user?.avt);
  },[user])

  const handleOnchangeEmail= (value) => {
    setEmail(value)
  }

  const handleOnchangeName= (value) => {
    setName(value)
  }

  const handleOnchangePhone= (value) => {
    setPhone(value)
  }

  const handleOnchangeAddress= (value) => {
    setAddress(value)
  }

  const handleOnchangeAvt= async ({fileList}) => {
    const file= fileList[0];
    console.log(file);
    if(!file.url&&!file.preview) {
      file.preview= await getBase64(file.originFileObj)
    }
    setAvt(file.preview);
  }

  console.log(mutation)
console.log(data?.status)
  const handleUpdate=() =>{
    mutation.mutate({id:user?.id,email,name,phone,address,avt,access_token:user?.access_token})
  }
  return (
    <div className='profile-user'>
        <h1>Thông tin người dùng</h1>
        <div className='content-profile'>
           <div className='wrapper-input'>
                <label htmlFor='name'>Họ tên </label>
                <InputFormComponent 
                    id="name"
                    style={{width: '300px'}}
                    value={name} 
                    onChange={handleOnchangeName} 
                    placeholder={'Nhập họ tên'}
                />
              
           </div>

           <div className='wrapper-input'>
                <label htmlFor='email'>Email</label>
                <InputFormComponent 
                    id="email"
                    style={{width: '300px'}}
                    value={email} 
                    onChange={handleOnchangeEmail} 
                    placeholder={'Nhập họ email'}
                />
                {data?.status==='ERR'&&(
                  <p>{data.message}</p>
                )}
              
           </div>

           <div className='wrapper-input'>
                <label htmlFor='phone'> Số điện thoại</label>
                <InputFormComponent 
                    id="phone"
                    style={{width: '300px'}}
                    value={phone} 
                    onChange={handleOnchangePhone} 
                    placeholder={'Nhập họ số điện thoại'}
                />
              
           </div>

           <div className='wrapper-input'>
                <label htmlFor='address'> Địa chỉ</label>
                <InputFormComponent 
                    id="address"
                    style={{width: '300px'}}
                    value={address} 
                    onChange={handleOnchangeAddress} 
                    placeholder={'Nhập địa chỉ'}
                />
             
           </div>

            <div className='wrapper-input'>
                <label htmlFor='avt'> Ảnh đại diện</label>
    
                <Upload onChange={handleOnchangeAvt} >
                  <Button icon={<UploadOutlined />} >Tải lên</Button>
                </Upload>
                {avt&&(
                  <img src={avt} className='img-avt' alt="avt" />
                )}
              
            </div>

          <ButtonComponent
              disabled={!email}
              onClick={handleUpdate}
              styleButton={{
                background: '',
                marginLeft:'auto',
                height: '30px',
                width: 'fit-content',
                border: '1px solid rgb(26,148,255)',
                borderRadius: '4px',
              }}
              size= {40}
              textButton={'Cập nhật'}
              styleTextButton={{color: 'rgb(26,148,255)',fontSize:'15px',fontWeight:'600'}}
            />  

        </div>
    </div>
  )
}

export default ProfilePage