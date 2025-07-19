import constructSlice, {
  addIngredient,
  moveIngredient,
  removeIngredient,
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

const mockBun: TConstructorIngredient = {
  ...mockIngredient,
  _id: '2',
  type: 'bun',
  name: 'Bun'
};

const initialState = {
  bun: null,
  ingredients: [],
  status: 'idle' as const
};

describe('Тестирование ConstructSlice', () => {
  test('Должен обрабатываться moveIngredient', () => {
    const initialState = {
      bun: null,
      ingredients: [mockIngredient, { ...mockIngredient, uuid: '2' }],
      status: 'idle' as const
    };
    const action = moveIngredient({ fromIndex: 0, toIndex: 1 });
    const state = constructSlice.reducer(initialState, action);
    expect(state.ingredients[0].uuid).toBe('2');
    expect(state.ingredients[1].uuid).toBe('123');
  });

  test('Должен обрабатываться addIngredient для булки', () => {
    const bun = { ...mockIngredient, type: 'bun' };
    const state = constructSlice.reducer(initialState, addIngredient(bun));
    expect(state.bun).toEqual(bun);
  });

  test('Должен обрабатываться addIngredient для булки', () => {
    const stateWithBun = { ...initialState, bun: mockBun };
    const newBun = { ...mockBun, _id: 'new-bun' };
    const state = constructSlice.reducer(stateWithBun, addIngredient(newBun));
    expect(state.bun).toEqual(newBun);
  });

  test('Должен обрабатываться removeIngredient', () => {
    const stateWithIngredient = {
      ...initialState,
      ingredients: [mockIngredient]
    };
    const action = removeIngredient(mockIngredient.uuid);
    const state = constructSlice.reducer(stateWithIngredient, action);
    expect(state.ingredients).toEqual([]);
  });

  test('Должен обрабатываться clearConstructor', () => {
    const stateWithData = {
      bun: mockBun,
      ingredients: [mockIngredient],
      status: 'idle' as const
    };
    const action = constructSlice.actions.clearConstructor();
    const state = constructSlice.reducer(stateWithData, action);
    expect(state).toEqual(initialState);
  });
});
