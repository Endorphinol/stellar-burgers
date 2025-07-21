import orderSlice, { createOrder } from './orderSlice';

describe('orderSlice', () => {
  const initialState = {
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  test('Должен обрабатываться createOrder.fulfilled', () => {
    const mockOrder = { number: 1234 };
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };
    const state = orderSlice.reducer(initialState, action);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.orderRequest).toBe(false);
  });

  test('Должен обрабатываться createOrder.rejected', () => {
    const error = { message: 'Error message' };
    const action = {
      type: createOrder.rejected.type,
      payload: error
    };
    const state = orderSlice.reducer(initialState, action);
    expect(state.error).toBe(error.message);
    expect(state.orderRequest).toBe(false);
  });
});
