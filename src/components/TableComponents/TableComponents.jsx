import {Table } from 'antd'
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { useState } from 'react';

const TableComponents = (props) => {

  const {selectionType= 'checkbox',data=[],columns=[],isLoading=false,
  handleDeleteMany=false }=props;
  const [rowSelectedKeys,setRowSelectedKeys]=useState([]);
  
  const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
      console.log(selectedRowKeys)
  },
  // getCheckboxProps: record => ({
  //   disabled: record.name === 'Disabled User', 
  // }),
  };
  const handleDeleteAll=() =>{
    if(handleDeleteMany){
      handleDeleteMany(rowSelectedKeys);
      setRowSelectedKeys([]);
    }
  }
  

  
  return (
    <LoadingComponent isPending={isLoading}>

      {rowSelectedKeys.length>0&&(
        <div 
          onClick={handleDeleteAll}
          style={{
            background: '#1d1ddd',
            color: '#fff',
            fontWeight: 'bold',
            padding: '10px',
            cursor:'pointer'
          }}
        >
          Xóa
        </div>
      )}
      <Table 
            rowSelection={{ type: selectionType, ...rowSelection }}
            columns={columns}
            dataSource={data}
            {...props}
        />
    </LoadingComponent>
  )
}

export default TableComponents