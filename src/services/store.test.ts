// store.test.ts
import { rootReducer } from './store';
import { UnknownAction } from 'redux';

describe('rootReducer', () => {
  it('should return initial state', () => {
    const state = rootReducer(undefined, {} as UnknownAction);
    expect(state).toEqual({
      auth: {
        /* ... */
      },
      constructor: {
        /* ... */
      }
      // ... остальные слайсы
    });
  });
});
