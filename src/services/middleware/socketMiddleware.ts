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

export const socketMiddleware =
  (wsUrl: string): Middleware<{}, RootState> =>
  (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      const { dispatch } = store;

      if (connectionStart.match(action)) {
        socket = new WebSocket(wsUrl);
      }

      if (connectionClosed.match(action)) {
        socket?.close();
        socket = null;
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
            const data = JSON.parse(event.data) as TOrdersData;
            if (data.orders && data.total !== undefined) {
              dispatch(getMessage(data));
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
