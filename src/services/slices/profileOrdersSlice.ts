import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder, TOrdersData } from '../../utils/types';
import { RootState } from '../store';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  Connected: boolean;
};

export const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
  Connected: false
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response.orders;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    ConnectionStart: (state, action: PayloadAction<string>) => {
      state.Connected = true;
    },
    ConnectionSuccess: (state) => {
      state.Connected = true;
    },
    ConnectionError: (state, action: PayloadAction<string>) => {
      state.Connected = false;
      state.error = action.payload;
    },
    ConnectionClosed: (state) => {
      state.Connected = false;
    },
    GetMessage: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при загрузке заказов';
      });
  }
});

export const {
  ConnectionStart,
  ConnectionSuccess,
  ConnectionError,
  ConnectionClosed,
  GetMessage
} = profileOrdersSlice.actions;
export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;
export default profileOrdersSlice.reducer;
