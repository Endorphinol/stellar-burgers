import orderSlice, { createOrder } from './orderSlice';

describe('orderSlice', () => {
  test('Должен обрабатываться createOrder.pending', () => {
    const state = orderSlice.reducer(initialState, createOrder.pending);
    expect(state.orderRequest).toBe(true);
  });
});
