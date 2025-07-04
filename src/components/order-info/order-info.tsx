import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { setOrderModalData } from '../../services/slices/orderSlice';

type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const { orderModalData } = useAppSelector((state) => state.order);
  const { orders: feedOrders } = useAppSelector((state) => state.feed);
  const { orders: profileOrders } = useAppSelector(
    (state) => state.profileOrders
  );

  useEffect(() => {
    if (!number) return;

    const existingOrder = [...feedOrders, ...profileOrders].find(
      (order) => order.number === Number(number)
    );

    if (existingOrder) {
      dispatch(setOrderModalData(existingOrder));
    } else {
      getOrderByNumberApi(Number(number))
        .then((response) => {
          if (response.success && response.orders.length > 0) {
            dispatch(setOrderModalData(response.orders[0]));
          } else {
            dispatch(setOrderModalData(null));
          }
        })
        .catch((error) => {
          console.error('Failed to load order:', error);
          dispatch(setOrderModalData(null));
        });
    }
  }, [number, dispatch, feedOrders, profileOrders]);

  const orderInfo = useMemo(() => {
    const order = orderModalData;
    if (!order || !ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce((acc, item) => {
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
      ...order,
      ingredientsInfo,
      date: new Date(order.createdAt),
      total: Object.values(ingredientsInfo).reduce(
        (sum, { price, count }) => sum + price * count,
        0
      )
    };
  }, [orderModalData, ingredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
