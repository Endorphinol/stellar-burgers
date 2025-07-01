import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from './store';
import { getUserApi } from '@api';


interface IProtectedRoute {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
}

export const ProtectedRoute: FC<IProtectedRoute> = ({
  onlyUnAuth = false,
  children
}) => {
  const user = useSelector(getUserApi);
  const location = useLocation();

  if (onlyUnAuth && user) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
