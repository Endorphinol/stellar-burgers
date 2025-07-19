import ingredientsSlice, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

// Тестовые данные
const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: '',
  image_mobile: '',
  image_large: ''
};

const initialState = {
  ingredients: [] as TIngredient[],
  loading: false,
  error: null as string | null
};

describe('Тестирование ingredientsSlice', () => {
  it('Должен обрабатываться fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Должен обрабатываться fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: [mockIngredient]
    };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.ingredients).toEqual([mockIngredient]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('Должен обрабатываться fetchIngredients.rejected', () => {
    const error = { message: 'Ошибка загрузки' };
    const action = {
      type: fetchIngredients.rejected.type,
      payload: error
    };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.error).toBe(error.message);
    expect(state.loading).toBe(false);
  });
});
