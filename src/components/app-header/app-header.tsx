import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '../../services/store';
import { selectUser } from '../../services/slices/authSlice';

export const AppHeader: FC = () => {
  const userName = useAppSelector(selectUser)?.name || '';
  return <AppHeaderUI userName={userName} />;
};
