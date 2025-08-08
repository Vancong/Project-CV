import React, { useRef, useState } from 'react';
import { AutoComplete, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch } from '../../redux/slices/ProductSlice';
import { useNavigate } from 'react-router-dom';
import * as ProductService from '../../services/Product.Services';
import {Fomater} from "../../utils/fomater"
import { debounce } from 'lodash';
import './SearchAutoComponent.scss';

const SearchAutoComponent = () => {
  const [options, setOptions] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const search=useSelector((state) =>state.product.search)


  const handleSearch = debounce(async (value) => {
    if (!value.trim()) return setOptions([]);
    try {
      const res = await ProductService.getAllProduct({ search: value });
      const data = res.data?.map((item) => ({
        value: item.name,
        key: item.slug,
        label: (  
          <div className="search-option">
                <div className='search_left'>
                 <img src={item.images[0]} alt={item.name} />
                </div>
           
                <div className="search_right">
                    <div className="name">
                        {item.name.split(new RegExp(`(${value})`, 'gi')).map((text, index) => {
                            const isMatch = text.toLowerCase() === value.toLowerCase();
                            if (isMatch) {
                                 return <strong key={index}>{text}</strong>; 
                            } else {
                                return <span key={index}>{text}</span>;     
                            }
                        })}
                    </div>
                    <div className="price">{Fomater(item.sizes[0].price)}</div>
                </div>
          </div>
        ),
      }));
      setOptions([
        {
          label: <strong>Sản phẩm</strong>,
          options: data,
        },
      ]);
    } catch {
      setOptions([]);
    }
  }, 300);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
      if (!search.trim()) return;
      dispatch(setSearch(search));
      setOptions([]);
      navigate('/type/search');
    }
  };

    const handleSelect = (value, option) => {
      if (option?.key) {
          navigate(`/product-details/${option.key}`,
          {state:{ product: option.value}});
      } else {
          dispatch(setSearch(value));
          navigate('/');
      }
    };


  return (
    <AutoComplete
      value={search} 
      options={options}
      style={{ width: '100%' }}
      onSearch={handleSearch}
      onSelect={handleSelect}
      className="custom-auto-complete"
      popupClassName="custom-dropdown"
    >
      <Input
        ref={inputRef} 
        size="large"
        placeholder="Nhập tên sản phẩm..."
        onChange={(e) => {
          dispatch(setSearch(e.target.value))
        }}
        onKeyDown={handleKeyDown}
        allowClear
      />
    </AutoComplete>
  );
};

export default SearchAutoComponent;
