import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectOrder } from '../../services/slices/orderSlice';
import { useAppSelector } from '../../services/store';

type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

export const OrderInfo: FC = () => {
  const orderData = useAppSelector(selectOrder).orderModalData;
  const ingredients = useAppSelector(selectIngredients);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce((acc, item) => {
      const ingredient = ingredients.find((ing) => ing._id === item);
      if (!ingredient) return acc;

      acc[item] = {
        ...ingredient,
        count: (acc[item]?.count || 0) + 1
      };
      return acc;
    }, {} as TIngredientsWithCount);

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date: new Date(orderData.createdAt),
      total: Object.values(ingredientsInfo).reduce(
        (sum, { price, count }) => sum + price * count,
        0
      )
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
