import authSlice, { loginUser, checkUserAuth } from './authSlice';

const initialState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

describe('authSlice', () => {
  it('Должен обрабатываться loginUser.pending', () => {
    const action = { type: 'auth/login/pending' };
    const state = authSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });
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
