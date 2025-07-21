import authSlice, { loginUser, checkUserAuth } from './authSlice';

const initialState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

describe('authSlice', () => {
  test('Должен обрабатываться loginUser.pending', () => {
    const action = { type: 'auth/login/pending' };
    const state = authSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });
});

test('Должен обрабатываться loginUser.rejected', () => {
  const error = 'Auth failed';
  const action = {
    type: loginUser.rejected.type,
    error: { message: error }
  };
  const state = authSlice.reducer(initialState, action);
  expect(state.error).toBe(error);
  expect(state.isLoading).toBe(false);
});

test('Должен обрабатываться checkUserAuth.fulfilled', () => {
  const user = { name: 'Test', email: 'test@test.com' };
  const payload = {
    success: true,
    user,
    accessToken: 'token',
    refreshToken: 'refresh'
  };
  const state = authSlice.reducer(
    initialState,
    checkUserAuth.fulfilled(payload, '')
  );
  expect(state.user).toEqual(user);
  expect(state.isAuthChecked).toBe(true);
});
