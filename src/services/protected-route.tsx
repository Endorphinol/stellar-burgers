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
  const isAuth =
    useAppSelector(selectIsAuthChecked) && useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAuthLoading);
  const location = useLocation();

  if (isLoading) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }

  if (onlyUnAuth && isAuth) {
    const from = location.state?.from?.pathname || '/profile';
    return <Navigate to={from} replace />;
  }

  return children;
};
