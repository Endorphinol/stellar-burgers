import authSlice, { loginUser, checkUserAuth } from './authSlice';

describe('authSlice', () => {
  test('Должен обрабатываться loginUser.pending', () => {
    const state = authSlice.reducer(initialState, loginUser.pending);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Должен обрабатываться checkUserAuth.fulfilled', () => {
    const user = { name: 'Test', email: 'test@test.com' };
    const state = authSlice.reducer(
      initialState,
      checkUserAuth.fulfilled({ user }, '')
    );
    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
  });
});
