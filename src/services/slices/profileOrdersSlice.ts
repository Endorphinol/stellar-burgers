import { TOrder } from '@utils-types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { RootState } from '../store';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
  isConnected: false
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    connectionStart: (state) => {
      state.isConnected = true;
    },
    connectionSuccess: (state) => {
      state.isConnected = true;
    },
    connectionError: (state, action: PayloadAction<string>) => {
      state.isConnected = false;
      state.error = action.payload;
    },
    connectionClosed: (state) => {
      state.isConnected = false;
    },
    getMessage: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
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
        state.error = action.error.message || 'Ошибка в получений заказа';
      });
  }
});

export const {
  connectionStart,
  connectionSuccess,
  connectionError,
  connectionClosed,
  getMessage
} = profileOrdersSlice.actions;

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;
export const selectProfileOrdersStatus = (state: RootState) => ({
  isLoading: state.profileOrders.isLoading,
  error: state.profileOrders.error,
  isConnected: state.profileOrders.isConnected
});

export default profileOrdersSlice.reducer;
