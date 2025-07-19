import orderSlice, { createOrder } from './orderSlice';

const initialState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

describe('orderSlice', () => {
  test('Должен обрабатываться createOrder.pending', () => {
    const action = { type: 'order/create/pending' };
    const state = orderSlice.reducer(initialState, action);
    expect(state.orderRequest).toBe(true);
  });
});
