import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';
import { RootState } from '../store';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    const response = await getIngredientsApi();
    return response as TIngredient[];
  }
);

type TIngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  loading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Ошибка при загрузке ингридиентов';
      });
  }
});

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;

export default ingredientsSlice.reducer;
