import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../services/store';
import {
  selectAuthError,
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
  const user = useAppSelector(selectUser);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const location = useLocation();

  if (isLoading || !isAuthChecked) {
    return <Preloader />;
  }

  if (error && !onlyUnAuth) {
    return <Navigate to='/error' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
