import React from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
import Footer from '../Footer/Footer'

const DefaultCompoent = ({children}) => {
  return (
    <div>
        <HeaderComponent />
        {children}
        <Footer/>
       
    
    </div>
  )
}

export default DefaultCompoent