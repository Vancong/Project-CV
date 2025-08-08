import { createSlice } from '@reduxjs/toolkit';

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: {
    productIds: [], 
    total: 0
  },
  reducers: {
    setFavoriteIds: (state, action) => {
      const {total,productIds}=action.payload;
      state.productIds = productIds;
      state.total=total;
    },
    toggleFavorite: (state, action) => {
      if (!state.productIds.includes(action.payload)) {
        state.productIds.push(action.payload);
        state.total++;
      }
      else {
        state.productIds = state.productIds.filter(id => id !== action.payload);
        state.total--;
      }
    },
    resetFavorite: (state) =>{
        state.productIds=[];
        state.total=0;
    }
  },
});

export const { setFavoriteIds, toggleFavorite, resetFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
