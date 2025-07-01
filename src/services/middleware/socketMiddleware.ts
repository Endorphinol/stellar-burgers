import { Middleware } from 'redux';
import { AppDispatch, RootState } from '../store';
import {
  ConnectionStart,
  ConnectionSuccess,
  ConnectionError,
  ConnectionClosed,
  GetMessage
} from '../slices/feedSlice';
import { TOrdersData } from '@utils-types';

export const socketMiddleware = (): Middleware<{}, RootState> => (store) => {
  let socket: WebSocket | null = null;

  return (next) => (action) => {
    const { dispatch } = store;

    if (ConnectionStart.match(action)) {
      socket = new WebSocket(action.payload);
    }

    if (socket) {
      socket.onopen = () => {
        dispatch(ConnectionSuccess());
      };

      socket.onerror = (event) => {
        dispatch(ConnectionError('WebSocket error'));
      };

      socket.onclose = () => {
        dispatch(ConnectionClosed());
      };

      socket.onmessage = (event) => {
        const { data } = event;
        const parsedData = JSON.parse(data) as TOrdersData;
        dispatch(GetMessage(parsedData));
      };
    }

    next(action);
  };
};
