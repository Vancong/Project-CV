
import {Input} from 'antd';
const  InputFormComponent = (props) => {
  const {placeholder='Nhập text',...rests}=props;
  const handleOnchangeInput= (e) =>{
    props.onChange(e.target.value);
  }
  return (
  
        <>
            <Input placeholder={placeholder} value={props.value} {...rests} onChange={handleOnchangeInput} />
        </>
     
 
  )
}

export default InputFormComponent