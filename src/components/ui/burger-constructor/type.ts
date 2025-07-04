import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export interface BurgerConstructorUIProps {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  onClose: () => void;
}
