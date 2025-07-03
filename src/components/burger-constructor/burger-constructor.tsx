import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import {
  clearConstructor,
  selectConstructorBun,
  selectConstructorIngredients
} from '../../services/slices/constructSlice';
import { selectUser } from '../../services/slices/authSlice';
import { createOrder } from '../../services/slices/orderSlice';
import { useAppDispatch, useAppSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const bun = useAppSelector(selectConstructorBun);
  const ingredients = useAppSelector(selectConstructorIngredients) || [];
  const user = useAppSelector(selectUser);
  const { orderRequest, orderModalData } = useAppSelector(
    (state) => state.order
  );

  const handleOrderClick = async () => {
    if (!bun || ingredients.length === 0 || orderRequest) return;

    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    try {
      const ingredientIds = [
        bun._id,
        ...ingredients.map((item) => item._id),
        bun._id
      ];
      const result = await dispatch(createOrder(ingredientIds)).unwrap();
      if (result) {
        dispatch(clearConstructor());
      }
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
    }
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={() => dispatch(clearConstructor())}
    />
  );
};
