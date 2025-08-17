import React from 'react'
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';


const TypeProduct = ({name,onClick}) => {

  const navigate=useNavigate();
  const handleNatvigateType=(type) =>{
    const slug = slugify(type, { lower: true });
    let newPath = slug === 'trang-chu' ? '/' : `/type/${slug}`;
    if (window.location.pathname === newPath) {
      navigate(0); 
    } else {
      navigate(newPath, { state: type });
    }
  }
  return (
    <div style={{cursor:'pointer',padding:'10px 0px'}} onClick={() =>handleNatvigateType(name)}>  {name}</div>
  )
}

export default TypeProduct