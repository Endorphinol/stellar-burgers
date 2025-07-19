import orderSlice, { createOrder } from './orderSlice';

const initialState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

describe('orderSlice', () => {
  test('Должен обрабатываться createOrder.pending', () => {
    const state = orderSlice.reducer(
      initialState,
      createOrder.pending('', ['ingredient1', 'ingredient2'])
    );
    expect(state.orderRequest).toBe(true);
  });
});
