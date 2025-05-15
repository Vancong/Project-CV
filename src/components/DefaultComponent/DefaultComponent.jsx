import React from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent'

const DefaultCompoent = ({children}) => {
  return (
    <div>
        <HeaderComponent />
        {children}
       
    
    </div>
  )
}

export default DefaultCompoent