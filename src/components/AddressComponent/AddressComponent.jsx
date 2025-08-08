import React, { useEffect, useState } from 'react'
import axios from 'axios';

const AddressComponent = ({onAddressChange}) => {
    const [provinceList, setProvinceList] = useState([]);       
    const [districtList, setDistrictList] = useState([]);       
    const [wardList, setWardList] = useState([]);  
    
    const [selectedProvince, setSelectedProvince] = useState(null); 
    const [selectedDistrict, setSelectedDistrict] = useState(null);  
    const [selectedWard, setSelectedWard] = useState(null); 

    useEffect(() => {
        const fetchProvinces = async () => {
        try {
        const res = await axios.get('https://provinces.open-api.vn/api/?depth=3');
        setProvinceList(res.data);
        } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh:", error);
        }
    };

    fetchProvinces();
   }, []);

  const handleProvinceChange =(e) =>{
    const selectedCode = parseInt(e.target.value);
    const province = provinceList.find(province => province.code === selectedCode);
    if (province) {
        setSelectedProvince(province); 
        setDistrictList(province.districts || []);
        setSelectedDistrict(null); 
        setWardList([]); 
        setSelectedWard(null); 
        onAddressChange({ province: province.name, district: null, ward: null });
      }
  }

  const handleDistrictChange = (e) => {
    const selectedCode = parseInt(e.target.value);
    const district = districtList.find((district) => district.code === selectedCode);

    if (district) {
      setSelectedDistrict(district); 
      setWardList(district.wards || []);
      onAddressChange({ province: selectedProvince.name, district:district.name,wrad:null})
    }
  };

   const handleWardChange = (e) => {
    const selectedCode = parseInt(e.target.value);
    const ward = wardList.find(w => w.code === selectedCode);
    if (ward) {
      setSelectedWard(ward);
      onAddressChange({ province: selectedProvince.name, district: selectedDistrict.name, ward: ward.name });
    }
  };

  return (
    <div>
        <select onChange={handleProvinceChange} value={selectedProvince?.code || ''}>
            <option value="">Chọn tỉnh/thành phố</option>
            {provinceList.map((province) => (
            <option key={province.code} value={province.code}>{province.name}</option>
            ))}
        </select>

        <select onChange={handleDistrictChange}  value={selectedDistrict?.code || ''}>
            <option value="">Chọn quận/huyện</option>
            {districtList.map(district => (
            <option key={district.code} value={district.code}>{district.name}</option>
            ))}
        </select>

        <select onChange={handleWardChange} value={selectedWard?.code || ''}>
            <option value="">Chọn xã/phường</option>
            {wardList.map(ward => (
            <option key={ward.code} value={ward.code}>{ward.name}</option>
            ))}
        </select>

    </div>
  )
}

export default AddressComponent