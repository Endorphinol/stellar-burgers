import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { FeedUI } from '@ui-pages';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector((state) => state.feed);
  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading) return <Preloader />;

  if (error) return <div>Ошибка: {error}</div>;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
