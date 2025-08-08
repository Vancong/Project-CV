import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  search:'',

}

export const ProductSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
  setSearch: (state, action) => {
    state.search = action.payload;
  },
  }
})

// Action creators are generated for each case reducer function
export const { setSearch  } = ProductSlice.actions

export default ProductSlice.reducer