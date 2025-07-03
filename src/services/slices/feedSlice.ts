import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const fetchFeeds = createAsyncThunk(
  'feed/fetchAll',
  async () => await getFeedsApi()
);

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  wsConnected: boolean;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  wsConnected: false
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    connectionStart: (state) => {
      state.wsConnected = true;
    },
    connectionSuccess: (state) => {
      state.wsConnected = true;
    },
    connectionError: (state, action) => {
      state.wsConnected = false;
      state.error = action.payload;
    },
    connectionClosed: (state) => {
      state.wsConnected = false;
    },
    getMessage: (state, action) => {
      const { orders, total, totalToday } = action.payload;
      state.orders = orders;
      state.total = total;
      state.totalToday = totalToday;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при получении ленты заказов';
      });
  }
});

export const {
  connectionStart,
  connectionSuccess,
  connectionError,
  connectionClosed,
  getMessage
} = feedSlice.actions;

export default feedSlice;
