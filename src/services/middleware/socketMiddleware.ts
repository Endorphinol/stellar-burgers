import { Middleware } from 'redux';
import { RootState } from '../store';
import {
  connectionStart,
  connectionSuccess,
  connectionError,
  connectionClosed,
  getMessage
} from '../slices/feedSlice';
import { TOrdersData } from '@utils-types';

export const socketMiddleware = (): Middleware<{}, RootState> => (store) => {
  let socket: WebSocket | null = null;

  return (next) => (action) => {
    const { dispatch } = store;

    if (connectionStart.match(action)) {
      if (typeof action.payload === 'string') {
        socket = new WebSocket(action.payload);
      } else {
        console.error('Ошибка');
        return;
      }
    }

    if (connectionClosed.match(action)) {
      if (socket) {
        socket.close();
        socket = null;
      }
    }

    if (socket) {
      socket.onopen = () => {
        dispatch(connectionSuccess());
      };

      socket.onerror = (event) => {
        dispatch(connectionError('Ошибка соединения'));
      };

      socket.onclose = () => {
        dispatch(connectionClosed());
      };

      socket.onmessage = (event) => {
        try {
          const { data } = event;
          const parsedData: TOrdersData = JSON.parse(data);
          if (parsedData.orders && parsedData.total !== undefined) {
            dispatch(getMessage(parsedData));
          }
        } catch (error) {
          console.error('Ошибка парсинга данных:', error);
          dispatch(connectionError('Ошибка формата данных'));
        }
      };
    }

    next(action);
  };
};
