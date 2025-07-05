import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../services/store';
import {
  selectAuthLoading,
  selectIsAuthChecked,
  selectUser
} from '../services/slices/authSlice';
import { Preloader } from '@ui';

interface IProtectedRoute {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
}

export const ProtectedRoute: FC<IProtectedRoute> = ({
  onlyUnAuth = false,
  children
}) => {
  const location = useLocation();
  const { isLoading, isAuth } = useAppSelector((state) => ({
    isLoading: selectAuthLoading(state),
    isAuth: selectIsAuthChecked(state) && selectUser(state)
  }));

  if (isLoading) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && isAuth) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};
