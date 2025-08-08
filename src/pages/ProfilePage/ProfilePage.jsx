import React, { useEffect, useState } from 'react'
import InputFormComponent from '../../components/InputFormComponent/InputFormComponent'
import './ProfilePage.scss'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from "../../services/User.Service"
import { useMutationHook } from '../../hooks/useMutationHook';
import { updateUser } from '../../redux/slices/UserSlice'
import { Button, Upload } from 'antd';
import { alertSuccess,alertError } from '../../utils/alert';
import {UploadOutlined} from "@ant-design/icons";
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
const ProfilePage = () => {
  const user=useSelector(state =>state.user);
  const dispatch=useDispatch();

  const [avt,setAvt]=useState(user?.avt);
  const [emailError, setEmailError] = useState('');
  const [fileList, setFileList] = useState([]);
   const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avt: user?.avt || null,
  });
  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      avt: user?.avt || null,
    });
    setFileList([]);
  }, [user]);


  const handleChange = (newValue, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    if(name === 'email') {
      if (!validateEmail(newValue)) {
        setEmailError('Email không hợp lệ');
      } else {
        setEmailError('');
      }
    }
  };
  const handleOnchangeAvt = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      setFormData((prev) => ({
        ...prev,
        avt: fileList[0]?.originFileObj,
      }));
      const previewUrl = URL.createObjectURL(fileList[0]?.originFileObj);
      setAvt(previewUrl);
    }
  };


  const validateEmail = (email) => {
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return reg.test(email);
  };

  const mutation = useMutationHook(async ({id,dataUser,access_token}) => {
      const res = await UserService.updateUser(id, dataUser, access_token);

     
      dispatch(updateUser({ access_token, ...res.user }));
      return res;
  });

  const{data,isSuccess,isError,isPending,error}=mutation;

  useEffect(()=>{
    if(isSuccess&&data?.status==='OK') {
      alertSuccess('Thành Công','Cập nhật thành công');
    }
    else if(isError&&error?.response?.data=='ERR'){
      alertError('Thất bại','Cập nhật thất bại');
    }
  },[isError,isSuccess])

const handleUpdate = () => {
    if (!formData.email) {
      setEmailError('Email không được để trống');
      return;
    }
    if (!validateEmail(formData.email)) {
      setEmailError('Email không hợp lệ');
      return;
    }

    setEmailError('');
    const dataUser = new FormData();
    dataUser.append('name', formData.name);
    dataUser.append('email', formData.email);
    dataUser.append('phone', formData.phone);
    dataUser.append('address', formData.address);
    if (fileList[0]) {
      dataUser.append('avt', fileList[0].originFileObj);
    }
    
    mutation.mutate({
      id: user?.id,
      access_token: user?.access_token,
      dataUser
    });
  };

  
  return (
    <div className='profile-user'>
        <h1>Thông tin người dùng</h1>
        <LoadingComponent isPending={isPending}>
          <div className='content-profile'>
            <div className='wrapper-input'>
                  <label htmlFor='name'>Họ tên </label>
                  <InputFormComponent 
                      id="name"
                      style={{width: '300px'}}
                      value={formData.name} 
                      onChange={(value) => handleChange(value,'name')} 
                      placeholder={'Nhập họ tên'}
                      name="name"
                  />
                
            </div>

            <div className='wrapper-input'>
                  <label htmlFor='email'>Email</label>
                  <InputFormComponent 
                      id="email"
                      name="email"
                      style={{width: '300px'}}
                      value={formData.email} 
                      onChange={(value) => {
                      handleChange(value,'email') 
                          if (emailError) setEmailError('');
                      }} 
                      placeholder={'Nhập họ email'}                      
                  />
                     {emailError &&<span style={{color: 'red',marginTop:4}}>{emailError}</span>} 
            </div>
           

            <div className='wrapper-input'>
                  <label htmlFor='phone'> Số điện thoại</label>
                  <InputFormComponent 
                      id="phone"
                      name="phone"
                      type="number"
                      style={{width: '300px'}}
                      value={formData.phone} 
                      onChange={(value) => handleChange(value,'phone')}  
                      placeholder={'Nhập họ số điện thoại'}
                  />
                
            </div>

            <div className='wrapper-input'>
                  <label htmlFor='address'> Địa chỉ</label>
                  <InputFormComponent 
                      id="address"
                      name="address"
                      style={{width: '300px'}}                   
                      value={formData.address} 
                      onChange={(value) => handleChange(value,'address')} 
                      placeholder={'Nhập địa chỉ'}
                  />
              
            </div>

              <div className='wrapper-input'>
                  <label htmlFor='avt'> Ảnh đại diện</label>
      
                  <Upload onChange={handleOnchangeAvt}  
                          accept="image/*" 
                          multiple={false}
                          maxCount={1}
                          fileList={fileList}
                          showUploadList={false}
                          beforeUpload={() => false} >
                    <Button icon={<UploadOutlined />} >Tải lên</Button>
                  </Upload>
                  {avt&&(
                    <img src={avt} className='img-avt' alt="avt" />
                  )}
                
              </div>

            <ButtonComponent
                disabled={!formData.email}
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
        </LoadingComponent>
    </div>
  )
}

export default ProfilePage