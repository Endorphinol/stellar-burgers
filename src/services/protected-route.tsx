import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';
import { selectUser } from '../services/slices/authSlice';

interface IProtectedRoute {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
}

export const ProtectedRoute: FC<IProtectedRoute> = ({ onlyUnAuth = false, children }) => {
  const user = useSelector(selectUser);
  const location = useLocation();

  if (onlyUnAuth && user) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};