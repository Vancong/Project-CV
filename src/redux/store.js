import { configureStore } from '@reduxjs/toolkit'
import counterSlice  from './slices/counterSlice'
import userReducer from "./slices/UserSlice"
export const store = configureStore({
    reducer: {
        counter: counterSlice,
        user: userReducer
      },
  
})