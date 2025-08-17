import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slices/UserSlice"
import productReducer from './slices/ProductSlice'
import cartReducer from "./slices/CartSlice"
import favoriteRedcer from "./slices/FavoriteSlice.js"
import websiteInfoReducer from './slices/WebSiteInfo.js'
export const store = configureStore({
    reducer: {
        product: productReducer,
        user: userReducer,
        cart: cartReducer,
        favorite: favoriteRedcer,
         websiteInfo: websiteInfoReducer 
      },
  
})