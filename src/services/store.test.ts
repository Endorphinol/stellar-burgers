// store.test.ts
import { rootReducer } from './store';
import { UnknownAction } from 'redux';

describe('Тестирование rootReducer', () => {
  it('Должно обрабатываться начальное состояние', () => {
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
