import { createSlice } from '@reduxjs/toolkit';

const data =
  localStorage.getItem('data') !== null
    ? JSON.parse(String(localStorage.getItem('data')))
    : [];

const initialUsers = {
  data: {
    userData: data.userData,
    token: data.token,
    isLoggedIn: data.isLoggedIn,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUsers,
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;
      state.data.userData = user;
      state.data.token = token;
      state.data.isLoggedIn = true;
      localStorage.setItem('data', JSON.stringify(state.data));
    },
    logout: (state) => {
      state.data.userData = {};
      state.data.token = '';
      state.data.isLoggedIn = false;
      localStorage.setItem('data', JSON.stringify(state.data));
    },
  },
});

// export reducer and action createor
// Action creators are generated for each case reducer function
export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
