import React from 'react'
import "./Navbar.scss"
import { Checkbox,Rate} from 'antd';
const NavbarComponent = () => {

  const onChange= () => {};
  const renderContent= (type,options) => {
     switch(type) {
        case 'text' :
            return options.map(option => {
                return (
                        <span className='option_text'>{option}</span>
                )
            })
        case 'checkbox':
            return (
                <Checkbox.Group style={{ width: '100%',display:"flex",flexDirection:"column" ,gap:"12px"}} onChange={onChange}>
                    {options.map(option => {
                        return (
                            <Checkbox value={option.value}>{option.lable}</Checkbox>
                        )
                    })}
                 
                
                </Checkbox.Group>
            )
        case 'star': 
            return  options.map(option => {
                        return (
                           <div style={{display:"flex",gap:"4px"}}>
                                
                                 <Rate style={{fontSize:"12px"}} allowHalf defaultValue={option} />  
                                 <span className='star_text' >{`từ ${option} sao`}</span>
                           </div>
                        )
                    })
        case 'price': 
            return  options.map(option => {
                        return (
                            <div className='nav_price'>{option}</div>
                        )
                    })
        default :
            return {};
     }
  }
  return (
    <div className='navbar'>
        <h1>Laa</h1>
        <div className='nav_content'>
            {renderContent('text',['nuochoa','nuoc hoa nu'])}
           
        </div>
       
    </div>
  )
}

export default NavbarComponent