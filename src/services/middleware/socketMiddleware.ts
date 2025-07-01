import { Middleware } from 'redux';
import { RootState, AppDispatch } from '../store';
import {
  ConnectionStart,
  ConnectionSuccess,
  ConnectionError,
  ConnectionClosed,
  GetMessage
} from '../slices/feedSlice';

export const socketMiddleware = (): Middleware<{}, RootState> => {
  return (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      const { dispatch } = store as { dispatch: AppDispatch };

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
          const parsedData = JSON.parse(data);
          dispatch(GetMessage(parsedData));
        };
      }

      next(action);
    };
  };
};
