import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../services/slices/authSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useAppSelector(
    (state) => state.auth.isAuthChecked && state.auth.user
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (isAuth) {
      navigate('/');
      return;
    }

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      })
      .catch((err) => {
        setError(err.message || 'Ошибка при входе');
      });
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
