import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { FeedUI } from '@ui-pages';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.feed.orders);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
