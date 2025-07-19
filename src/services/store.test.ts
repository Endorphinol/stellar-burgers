import { rootReducer } from './store';
import { UnknownAction } from 'redux';

describe('rootReducer', () => {
  test('Должен вернуть Initial State', () => {
    const state = rootReducer(undefined, {} as UnknownAction);
    expect(state).toHaveProperty('constructor');
    expect(state).toHaveProperty('ingredients');
  });
});
