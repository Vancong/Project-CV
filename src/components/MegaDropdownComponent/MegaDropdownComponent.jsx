import { Dropdown } from "antd";
import { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import './MegaDropdownComponent.scss'
import *as BrandService from "../../services/Brand.Service";
import *as NoteGroupService from "../../services/NoteGroup.Service"
import TypeProduct from "../TypeProduct/TypeProduct";
import { useNavigate } from "react-router-dom";
const MegaDropdownComponent = ({ title, type,setSelected  }) => {
  const [dataList, setDataList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate=useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res=[];
        if(type==='brands') {
          res=await BrandService.getAllBrand();
        }
        else {
          res=await NoteGroupService.getAllNoteGroup();
        }
        setDataList(res.data);
      } catch (err) {
        console.error('loi', err);
      }
    };

    fetchData();
  }, [type]);

  const handleClickNoteGroup =(id,name) =>{
    const key=type;
    if (type==='barnds')type='thuong-hieu';
    else  type='note-huong'
    if(id) {
      navigate(`/type/${type}?${key}=${id}`,{state:name})
    }

  }
  const menuContent = (
    <div className="mega_menu">
      <ul>
        {dataList.map((item, index) => (
          <li onClick={()=>handleClickNoteGroup(item._id,item.name)} key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <Dropdown
      overlay={menuContent}
      trigger={["hover"]}
      placement="bottom"
      overlayClassName="mega_menu_dropdown"
      open={isOpen}
      onOpenChange={(flag) => setIsOpen(flag)}
    >
      <div onClick={() => {
            setSelected(title)
            setIsOpen(false);     
           }}
           className={`menu_title ${isOpen ? 'open' : ''}`}
      >
        <TypeProduct  name={title} />
         <DownOutlined className="arrow_icon" />
      </div>
    </Dropdown>
  );
};

export default MegaDropdownComponent;
