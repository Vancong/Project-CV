import React, { useEffect, useState } from 'react';
import "./FilterSidebarComponent.scss";
import *as NoteGroupService from "../../services/NoteGroup.Service";
import *as BrandSerivce from "../../services/Brand.Service";
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
const FilterSidebarComponent = ({ setOnFilter,slug,setCurrentPage}) => {

  const navigate= useNavigate()
  const [brands,setBrands]=useState([]);
  const [noteGroups,setNoteGroups]=useState([]);
  const location = useLocation();
  const [searchParams] =useSearchParams();

  const [tmpPrice,setTmpPrice]=useState('');
  const [tmpGender,setTmpGender]=useState('');
  const [tmpNoteGroup,setTmpNoteGroup]=useState([]);
  const [tmpBrand,setTmpBrand]=useState([]);

  useEffect(() => {
      const fetchBrands = async () => {
        try {
          const res = await BrandSerivce.getAllBrand();
          const res2 = await NoteGroupService.getAllNoteGroup();
          setBrands(res.data || []);
          setNoteGroups(res2.data||[])
    
        } catch (error) {
          setBrands([]); 
          setNoteGroups([]);
        }
      };

      fetchBrands();
    }, []);


  useEffect(() => {
    const price = searchParams.get('price') || '';
    const gender = searchParams.get('gender') || '';
    const notes = searchParams.get('notes')?.split(',') || [];
    const brands = searchParams.get('brands')?.split(',') || [];

    setTmpPrice(price);
    setTmpNoteGroup(notes);
    setTmpBrand(brands);

    if (slug === 'nuoc-hoa-nam') {
      setTmpGender('Nước Hoa Nam');
    } else if (slug === 'nuoc-hoa-nu') {
      setTmpGender('Nước Hoa Nữ');
    } else if (slug === 'nuoc-hoa-unisex') {
      setTmpGender('Nước Hoa Unisex');
    } else {
      setTmpGender(gender); 
    }

    if (slug === 'thuong-hieu' || slug === 'note-huong') {
      handleReset();
    }
  }, [location.search,slug]);


   const handleReset = () => {
      setTmpBrand([]);
      setTmpNoteGroup([]);
      setTmpPrice('');
      setTmpGender('');
  };


  const priceRanges = ['< 1.5 Triệu', '1.5 Triệu - 3 Triệu', '> 3 Triệu'];
  const genders = ['Nước Hoa Nam', 'Nước Hoa Nữ', 'Nước Hoa Unisex'];

 
  const handlePriceClick = (price) => {
    setTmpPrice(price)
  };

  const handleGenderClick = (gender) => {
     setTmpGender(gender)
  };

  const handleNoteClick = (note) => {
    let updateNoteGroup = [...tmpNoteGroup];
    if (updateNoteGroup.includes(note)) {
      updateNoteGroup = updateNoteGroup.filter(nt => nt !== note);
    } else {
      updateNoteGroup.push(note);
    }
    setTmpNoteGroup(updateNoteGroup)
  
  };

  const handleBrandClick = (brand) => {
    let updateBrands = [...tmpBrand];
    if (updateBrands.includes(brand)) {
      updateBrands = updateBrands.filter(br => br !== brand);
    } else {
      updateBrands.push(brand);
    }
    setTmpBrand(updateBrands);
    
  };

  const handleFilterClick=() =>{; 
    const queryParams = new URLSearchParams();
    if (tmpPrice) queryParams.set('price', tmpPrice);
    if (tmpGender) queryParams.set('gender', tmpGender);
    if (tmpBrand.length > 0) queryParams.set('brands', tmpBrand.join(','));
    if (tmpNoteGroup.length > 0) queryParams.set('notes', tmpNoteGroup.join(','));
    navigate(`/type/loc-san-pham?${queryParams.toString()}`, { state: 'Lọc Sản Phẩm' });

     setCurrentPage(1); 
   
  }


  return (
    <div className="filter_sidebar">
      <div className="filter_buttons">
        
        <button className="clear_btn" onClick={handleReset}>
          Xoá tất cả
        </button>
        <button className="filter_btn" onClick={handleFilterClick}>
          Lọc
        </button>

      </div>


      <div className="filter_group">
        <h4>Khoảng giá</h4> 
        <div className="filter_options">
          {priceRanges.map((price, index) => (
            <div
              key={index}
              className={`filter_item ${tmpPrice === price ? 'active' : ''} `}
              onClick={() => handlePriceClick(price)}
            >
              {price}
            </div>
          ))}
        </div>
      </div>

      <div className="filter_group">
        <h4>Giới tính:</h4>
        <div className="filter_options">
          {genders.map((gender, index) => (
            <div
              key={index}
              className={`filter_item ${tmpGender === gender ? 'active' : ''}`}
              onClick={() => handleGenderClick(gender)}
            >
              {gender}
            </div>
          ))}
        </div>
      </div>
      
      <div className="filter_group">
        <h4>Thương hiệu:</h4>
        <div className="filter_options brand_scroll">
          {brands?.map((brand, index) => (
            <div
              key={index}
              className={`filter_item ${tmpBrand.includes(brand._id) ? 'active' : ''} `}
              onClick={() => handleBrandClick(brand._id)}
            >
              {brand.name}
            </div>
          ))}
        </div>
      </div>

      <div className="filter_group ">
        <h4>Note Hương:</h4>
        <div className="filter_options brand_scroll">
          {noteGroups?.map((note, index) => (
            <div
              key={index}
              className={`filter_item ${tmpNoteGroup.includes(note._id) ? 'active' : ''} `}
              onClick={() => handleNoteClick(note._id)}
            >
              {note.name}
            </div>
          ))}
        </div>
      </div>

    
    </div>
  );
};

export default FilterSidebarComponent;
