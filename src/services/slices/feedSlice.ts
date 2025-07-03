import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type ApiError = {
  message: string;
  status?: number;
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (error) {
      return rejectWithValue({
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
        status: (error as any).response?.status
      } as ApiError);
    }
  }
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
      state.error = null;
    },
    connectionSuccess: (state) => {
      state.wsConnected = true;
      state.error = null;
    },
    connectionError: (state, action: PayloadAction<string>) => {
      state.wsConnected = false;
      state.error = action.payload;
    },
    connectionClosed: (state) => {
      state.wsConnected = false;
      state.error = null;
    },
    getMessage: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      const { orders, total, totalToday } = action.payload;
      state.orders = orders;
      state.total = total;
      state.totalToday = totalToday;
      state.error = null;
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
        state.error = null;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as ApiError).message ||
          'Ошибка при получении ленты заказов';
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
