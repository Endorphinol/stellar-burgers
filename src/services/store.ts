import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineSlices } from '@reduxjs/toolkit';
import profileOrdersSlice from './slices/profileOrdersSlice';
import feedSlice from './slices/feedSlice';
import constructorSlice from './slices/constructSlice';
import authSlice from './slices/authSlice';
import orderSlice from './slices/orderSlice';
import ingredientsSlice from './slices/ingredientsSlice';

export const rootReducer = combineSlices(
  authSlice,
  constructorSlice,
  orderSlice,
  feedSlice,
  profileOrdersSlice,
  ingredientsSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
