import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectOrder } from '../../services/slices/orderSlice';
import { useAppSelector } from '../../services/store';

type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

export const OrderInfo: FC = () => {
  const ingredients = useAppSelector(selectIngredients);
  const { orderModalData } = useAppSelector(selectOrder);

  const orderInfo = useMemo(() => {
    if (!orderModalData || !ingredients.length) return null;

    const ingredientsInfo = orderModalData.ingredients.reduce((acc, item) => {
      const ingredient = ingredients.find((ing) => ing._id === item);
      return ingredient
        ? {
            ...acc,
            [item]: {
              ...ingredient,
              count: (acc[item]?.count || 0) + 1
            }
          }
        : acc;
    }, {} as TIngredientsWithCount);

    return {
      ...orderModalData,
      ingredientsInfo,
      date: new Date(orderModalData.createdAt),
      total: Object.values(ingredientsInfo).reduce(
        (sum, { price, count }) => sum + price * count,
        0
      )
    };
  }, [orderModalData, ingredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
