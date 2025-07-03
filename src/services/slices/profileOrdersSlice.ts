import { TOrder } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';

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
      return await getOrdersApi();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      );
    }
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    connectionStart: (state) => {
      state.isConnected = true;
    },
    connectionSuccess: (state) => {
      state.isConnected = true;
    },
    connectionError: (state, action) => {
      state.isConnected = false;
      state.error = action.payload;
    },
    connectionClosed: (state) => {
      state.isConnected = false;
    },
    getMessage: (state, action) => {
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
        state.error = action.error.message || 'Ошибка при получении заказов';
      });
  },
  selectors: {
    selectProfileOrders: (state) => state.orders,
    selectProfileOrdersStatus: (state) => ({
      isLoading: state.isLoading,
      error: state.error,
      isConnected: state.isConnected
    })
  }
});

export const {
  connectionStart,
  connectionSuccess,
  connectionError,
  connectionClosed,
  getMessage
} = profileOrdersSlice.actions;

export const { selectProfileOrders, selectProfileOrdersStatus } =
  profileOrdersSlice.selectors;

export default profileOrdersSlice;
