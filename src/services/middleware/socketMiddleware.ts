import { Middleware, MiddlewareAPI } from 'redux';
import { AppDispatch, RootState } from '../store';
import {
  ConnectionStart,
  ConnectionSuccess,
  ConnectionError,
  ConnectionClosed,
  GetMessage
} from '../slices/feedSlice';

export const socketMiddleware =
  (): Middleware => (store: MiddlewareAPI<AppDispatch, RootState>) => {
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
          dispatch(ConnectionError(event.type));
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
