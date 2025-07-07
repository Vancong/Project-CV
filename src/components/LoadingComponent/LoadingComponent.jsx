import React from 'react'
import { Spin } from 'antd'
const LoadingComponent = ({children,isPending,delay=200}) => {
  return (
    <Spin spinning={isPending} delay={delay}>
        {children}
    </Spin>
  )
}

export default LoadingComponent