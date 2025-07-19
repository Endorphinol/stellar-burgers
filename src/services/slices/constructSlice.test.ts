import constructSlice, {
  addIngredient,
  moveIngredient
} from './constructSlice';

describe('Тестирование ConstructSlice', () => {
  test('should handle moveIngredient', () => {
    const initialState = {
      bun: null,
      ingredients: [{ uuid: '1' }, { uuid: '2' }],
      status: 'idle'
    };
    const action = moveIngredient({ fromIndex: 0, toIndex: 1 });
    const state = constructSlice.reducer(initialState, action);
    expect(state.ingredients).toEqual([{ uuid: '2' }, { uuid: '1' }]);
  });
});
