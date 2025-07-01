import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder, TOrdersData } from '../../utils/types';
import { RootState } from '../store';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  wsConnected: boolean;
};

export const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
  wsConnected: false
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
    wsConnectionStart: (state, action: PayloadAction<string>) => {
      state.wsConnected = true;
    },
    wsConnectionSuccess: (state) => {
      state.wsConnected = true;
    },
    wsConnectionError: (state, action: PayloadAction<string>) => {
      state.wsConnected = false;
      state.error = action.payload;
    },
    wsConnectionClosed: (state) => {
      state.wsConnected = false;
    },
    wsGetMessage: (state, action: PayloadAction<TOrdersData>) => {
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
  wsConnectionStart,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetMessage
} = profileOrdersSlice.actions;

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;
export default profileOrdersSlice.reducer;
