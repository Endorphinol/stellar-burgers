import { FC } from 'react';
import { Link } from 'react-router-dom';

export const AppHeader: FC = () => (
  <header>
    <nav>
      <Link to='/'>Конструктор</Link>
      <Link to='/feed'>Лента заказов</Link>
    </nav>
  </header>
);
