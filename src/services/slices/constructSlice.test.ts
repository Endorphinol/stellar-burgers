import constructSlice, {
  addIngredient,
  moveIngredient,
  TConstructorIngredient
} from './constructSlice';

const mockIngredient: TConstructorIngredient = {
  _id: '1',
  name: 'Ingredient',
  type: 'main',
  price: 100,
  image: '',
  image_mobile: '',
  image_large: '',
  calories: 0,
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  uuid: '123'
};

const initialState = {
  bun: null,
  ingredients: [mockIngredient],
  status: 'idle'
};

describe('Тестирование ConstructSlice', () => {
  test('Должен обрабатываться moveIngredient', () => {
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
