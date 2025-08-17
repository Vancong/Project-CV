import React from 'react'
import './Footer.scss'
import { useSelector } from 'react-redux'
import {FacebookOutlined,TikTokOutlined} from '@ant-design/icons'
const Footer = () => {
  const websiteInfo=useSelector(state => state.websiteInfo);
  return (
    <footer className="footer">
      <div className="footer-container">


        <div className="footer-top">
          <div className="footer-col">
            <h4>Về chúng tôi</h4>
            <ul>
              <li>Địa chỉ : {websiteInfo?.address}</li>
              <li>Số điện thoại : {websiteInfo?.phone}</li>
              <li>Email : {websiteInfo?.email}</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Chính sách</h4>
            <ul>
              <li>Chính sách đổi trả</li>
              <li>Chính sách bảo mật</li>
              <li>Điều khoản dịch vụ</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li>Hướng dẫn mua hàng</li>
              <li>Câu hỏi thường gặp</li>
              <li>Hỗ trợ khách hàng</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Kết nối</h4>
            <div className="social">
              <a href={websiteInfo?.socialLinks?.facebook}><FacebookOutlined /></a>
              <a href={websiteInfo?.socialLinks?.tiktok}> <TikTokOutlined /></a>
            </div>
          </div>
        </div>


        <div className="footer-bottom">
          © 2025 Công ty Nước Hoa. {websiteInfo?.name}.
        </div>

      </div>
    </footer>
  )
}

export default Footer
