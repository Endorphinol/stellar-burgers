import ingredientsSlice, { fetchIngredients } from './ingredientsSlice';

describe('Тестирование ingredientsSlice', () => {
  test('Должен обрабатываться fetchIngredients.rejected', () => {
    const error = { message: 'Error' };
    const state = ingredientsSlice.reducer(
      undefined,
      fetchIngredients.rejected(new Error('Ошибка'), '', undefined)
    );
    expect(state.error).toBe(error.message);
    expect(state.loading).toBe(false);
  });
});
