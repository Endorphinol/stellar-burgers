import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { RootState } from '../../services/store';

type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

export const OrderInfo: FC = () => {
  const orderData = useSelector(
    (state: RootState) => state.order.orderModalData
  );
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.items
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (!ingredient) return acc;

        const currentCount = acc[item]?.count || 0;
        return {
          ...acc,
          [item]: {
            ...ingredient,
            count: currentCount + 1
          }
        };
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
