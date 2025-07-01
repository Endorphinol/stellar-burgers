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
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Ошибка загрузки ингредиентов';
      });
  }
});

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const ingredientsReducer = ingredientsSlice.reducer;
export default ingredientsReducer;
