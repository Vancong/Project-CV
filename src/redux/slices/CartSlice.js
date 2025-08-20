import { createSlice } from '@reduxjs/toolkit';
import getDiscountPrice from '../../utils/getDiscountPrice';
const initialState = {
  items: [], 
  totalPrice: 0,
  total:0
};

const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = (action.payload?.items || []).map(item => {
        const discountPrice = getDiscountPrice(item.price, item.product.discount);
        return { ...item, price: discountPrice };
      });
      state.total = action.payload?.total || 0;
      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    addToCart: (state, action) => {
      const { product, quantity, volume, price } = action.payload;
      const discountPrice = getDiscountPrice(
        product.sizes.find(size => size.volume === volume)?.price || 0,
        product.discount
      );
      const checkItem = state.items.find(
        item => item.product._id === product._id && item.volume === volume
      );
   
      if (checkItem) {
        checkItem.quantity += quantity;
        state.totalPrice+=quantity*checkItem.price;
      } else {
        state.items.push({ product, quantity, volume, price:discountPrice});
        state.total+=1;
        console.log(state.total)
        state.totalPrice+=quantity*price;
      }
    },
    
    increaseQuantity: (state, action) => {
      const { productId, volume } = action.payload;
      const item = state.items.find(item => item.product._id === productId && item.volume === volume);
      if (item) {
        item.quantity += 1;
        state.totalPrice+=item.price;
      }
    },

    decreaseQuantity: (state, action) => {
      const { productId, volume } = action.payload;
      const item = state.items.find(item => item.product._id === productId && item.volume === volume);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalPrice-=item.price;
      } 
    },
    removeCart: (state, action) => {
      const { productId, volume } = action.payload;
      state.items = state.items.filter(item => item.product._id !== productId ||item.volume !== volume);
        console.log(state.totalPrice)
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      state.total-=1;
      console.log(state.totalPrice)
    },
    clearCart: (state) => {
      state.items = []; 
      state.total=0;
      state.totalPrice=0;
    }
  }
});

export const { addToCart, removeCart,increaseQuantity,
  decreaseQuantity, clearCart ,setCart} = CartSlice.actions;
export default CartSlice.reducer;
