import React, { Fragment } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import {Row,Col, Pagination} from "antd";
import './TypeProductsPage.scss';
const TypeProductsPage = () => {
  const onChange= () =>{

  }
  return (
   <div style={{padding:" 40px 120px"}}>
      <Row style={ {flexWrap:'nowrap',paddingTop:'10px'}}>
          <Col span={4} className='col_navbar'>
            <NavbarComponent />
          </Col>
          <Col span={20}  className='card'>
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
          </Col>
      </Row>
        <div className='pagination-wrapper'>
            <Pagination defaultCurrent={2} total={100} onChange={onChange} />
        </div>
   </div>
  )
}

export default TypeProductsPage



