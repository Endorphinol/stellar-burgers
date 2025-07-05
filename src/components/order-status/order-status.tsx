import React, { FC } from 'react';
import { OrderStatusProps } from './type';

const statusText: { [key: string]: string } = {
  done: 'Выполнен',
  pending: 'Готовится',
  created: 'Создан'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const textColor = status === 'done' ? '#00CCCC' : '#F2F2F3';

  return (
    <p
      className='text text_type_main-default mt-2'
      style={{ color: textColor }}
    >
      {statusText[status] || statusText.created}
    </p>
  );
};
