import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export type TConstructorIngredient = TIngredient & {
  uuid: string;
};

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  status: 'idle';
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  status: 'idle'
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          return {
            ...state,
            bun: { ...action.payload }
          };
        }
        return {
          ...state,
          ingredients: [...state.ingredients, { ...action.payload }]
        };
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          uuid: crypto.randomUUID()
        }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.uuid !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, removed);
    },
    clearConstructor: () => initialState
  },
  selectors: {
    selectConstructor: (state) => state,
    selectConstructorBun: (state) => state.bun,
    selectConstructorIngredients: (state) => state.ingredients
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export const {
  selectConstructor,
  selectConstructorBun,
  selectConstructorIngredients
} = constructorSlice.selectors;

export default constructorSlice;
