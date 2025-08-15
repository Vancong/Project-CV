import { Form, Input, Button, Upload, message, Row, Col } from "antd";
import { useEffect, useState } from "react";
import * as websiteInfoService from "../../services/websiteInfo.Service";
import  {useMutationHook}  from "../../hooks/useMutationHook.js"
import './AdminWebInfo.scss';
import { useSelector } from "react-redux";
import { alertError, alertSuccess } from "../../utils/alert.js";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "../LoadingComponent/LoadingComponent.jsx"
const AdminWebInfo = () => {
  const [form] = Form.useForm();
  const user=useSelector(state => state.user)
  const [fileListUpdate, setFileListUpdate] = useState([]);
  const [fileLogoUpdate,setFileLogoUpdate]= useState([]);
  const {isLoading,data: dataGetInfo}=useQuery({
      queryKey:['get-info'],
      queryFn:()=> websiteInfoService.getInfo(),
  })

useEffect(() => {
  if (dataGetInfo) {
    form.setFieldsValue({
      name: dataGetInfo.data.name || '',
      email: dataGetInfo.data.email || '',
      phone: dataGetInfo.data.phone || '',
      address: dataGetInfo.data.address || '',
      socialLinks: {
        facebook: dataGetInfo.data.socialLinks?.facebook || '',
        tiktok: dataGetInfo.data.socialLinks?.tiktok || '',
        zalo: dataGetInfo.data.socialLinks?.zalo || '',
      }
    });
    if(dataGetInfo.data?.banner?.length>0){
      const imageList=dataGetInfo.data.banner.map(url => (
        {
        uid:url,
        name: url.substring(url.lastIndexOf('/') + 1),
        status: 'OK',
        url,
        }
      ))
      setFileListUpdate(imageList)
    }
    else {
      setFileListUpdate([]);
    }
    if(dataGetInfo.data.logo) {
      const logo = [{
        uid: dataGetInfo.data.logo,
        name: dataGetInfo.data.logo.substring(dataGetInfo.data.logo.lastIndexOf('/') + 1),
        status: 'done',
        url: dataGetInfo.data.logo,
      }];
      setFileLogoUpdate(logo)
    }
    else {
      setFileLogoUpdate([])
    }
  }
}, [dataGetInfo, form]);
  const mutationUpdate= useMutationHook(async({data,access_token})=>{
     return await websiteInfoService.update(data,access_token)
  })

  const {isPending:isPendingUpdate,isSuccess,isError,error,data}=mutationUpdate;
  useEffect(()=>{
    if(data?.status==='OK'&&isSuccess) {
      alertSuccess('Cập nhật thông tin thành công')
    }
    else if(isError){
      alertError(`${error.message}`)
    }
  },[isSuccess,isError,data])




  const onFinish = async (values) => {
     const formData=new FormData();
     formData.append("name",values.name);
     formData.append("email",values.email||'');
     formData.append("phone",values.phone||'');
     formData.append("address",values.address||'');
     formData.append("updateBy",user?.name||user?.email);

    if (values.logo?.fileList?.length > 0) {
      const file = values.logo.fileList[0];
      if(file.originFileObj) {
        console.log(file.originFileObj)
        formData.append('logo', file.originFileObj);
      }
      else {
         formData.append('oldImglogo', file.url);
      }
      
    }

    const oldImgBanner=[];
    if (values.banner?.fileList?.length > 0) {
      values.banner?.fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('banner', file.originFileObj);
        }
        else if (file.url) {
          oldImgBanner.push(file.url);
        }
      });
    }
    formData.append('oldImgBanner', JSON.stringify(oldImgBanner));


    const socialLinks = {
      facebook: values.socialLinks.facebook,
      tiktok: values.socialLinks.tiktok,
      zalo: values.socialLinks.zalo,
    };
    formData.append("socialLinks", JSON.stringify(socialLinks));
    for (let [key, value] of formData.entries()) {
  console.log(key, value);
}

    
    mutationUpdate.mutate({data: formData,access_token:user?.access_token})

  };
  

  return (
   <LoadingComponent isPending={isLoading}>
      <div className="admin_websiteInfo">
        <h1>Quản lý thông tin Website</h1>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tên Website"
            name="name"
            rules={[{ required: true, message: 'Không được bỏ trống' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Logo" name="logo"   >
            <Upload listType="picture-card" fileList={fileLogoUpdate} maxCount={1}
                    beforeUpload={() => false} 
                    onChange={({ file, fileList }) => {
                      setFileLogoUpdate(fileList);
                    }}
                    >
              <div>Upload</div>
            </Upload>
          </Form.Item>

          <Form.Item label="Banner" name="banner"  >
            <Upload listType="picture-card" fileList={fileListUpdate}  multiple  
                    beforeUpload={() => false} 
                    onChange={({ fileList }) => setFileListUpdate(fileList)}
            >
              <div>Upload</div>
            </Upload>
          </Form.Item>

          <h2 >Thông tin liên hệ</h2>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Email" name="email">
                <Input type="email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện thoại" name="phone">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>

          <h2 >Mạng xã hội</h2>
          <Form.Item label="Facebook" name={["socialLinks", "facebook"]}>
            <Input />
          </Form.Item>
          <Form.Item label="TikTok" name={["socialLinks", "tiktok"]}>
            <Input />
          </Form.Item>
          <Form.Item label="Zalo" name={["socialLinks", "zalo"]}>
            <Input />
          </Form.Item>
        
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isPendingUpdate} >
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
   </LoadingComponent>
  );
};

export default AdminWebInfo;
