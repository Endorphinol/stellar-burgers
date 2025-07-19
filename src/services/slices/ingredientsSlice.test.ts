import ingredientsSlice, { fetchIngredients } from './ingredientsSlice';

describe('Тестирование ingredientsSlice', () => {
  test('should handle fetchIngredients.rejected', () => {
    const error = { message: 'Error' };
    const state = ingredientsSlice.reducer(
      undefined,
      fetchIngredients.rejected(new Error('Error'), '', undefined)
    );
    expect(state.error).toBe(error.message);
    expect(state.loading).toBe(false);
  });
});
