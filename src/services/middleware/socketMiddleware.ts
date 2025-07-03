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
        if (socket) {
          socket.close();
        }

        socket = new WebSocket(wsUrl);

        socket.onopen = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.onmessage = null;

        socket.onopen = () => {
          dispatch(connectionSuccess());
        };

        socket.onerror = (event) => {
          if (socket) {
            dispatch(connectionError('Ошибка соединения'));
            socket.close();
          }
        };

        socket.onclose = (event) => {
          if (socket) {
            dispatch(connectionClosed());
            socket = null;
          }
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as TOrdersData;
            if (data?.orders && data.total !== undefined) {
              dispatch(getMessage(data));
            }
          } catch (error) {
            console.error('Ошибка парсинга данных:', error);
            dispatch(connectionError('Ошибка формата данных'));
          }
        };
      }

      if (connectionClosed.match(action) && socket) {
        socket.onopen = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.onmessage = null;

        socket.close();
        socket = null;
      }

      return next(action);
    };
  };
