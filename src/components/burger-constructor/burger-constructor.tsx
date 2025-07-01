import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient, TOrder } from '@utils-types';
import {
  selectConstructor,
  clearConstructor
} from '../../services/slices/constructorSlice';
import { selectUser } from '../../services/slices/authSlice';
import { createOrder } from '../../services/slices/orderSlice';
import { useAppDispatch, useAppSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { bun, ingredients } = useAppSelector(selectConstructor);
  const user = useAppSelector(selectUser);
  const { orderRequest, orderModalData } = useAppSelector((state) => state.order);

  const handleOrderClick = () => {
    if (!bun || orderRequest) return;
    
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch((err) => {
        console.error('Failed to create order:', err);
      });
  };

  const handleCloseModal = () => {
    dispatch(clearConstructor());
  };

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};