import { Middleware } from 'redux';
import {
  ConnectionStart,
  ConnectionSuccess,
  ConnectionError,
  ConnectionClosed,
  GetMessage
} from '../slices/feedSlice';

export const socketMiddleware = (): Middleware => {
  return (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      const { dispatch } = store;
      const { type, payload } = action;

      if (type === ConnectionStart.type) {
        socket = new WebSocket(payload);
      }

      if (socket) {
        socket.onopen = () => dispatch(ConnectionSuccess());
        socket.onerror = (event) => dispatch(ConnectionError(event.type));
        socket.onclose = () => dispatch(ConnectionClosed());
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          dispatch(GetMessage(data));
        };
      }
      next(action);
    };
  };
};
