import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useAppSelector } from '../../services/store';
import { selectProfileOrders } from '../../services/slices/profileOrdersSlice';

export const ProfileOrders: FC = () => {
  const orders = useAppSelector(selectProfileOrders);

  return <ProfileOrdersUI orders={orders} />;
};
