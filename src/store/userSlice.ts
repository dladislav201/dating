import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/models";

const initialState: User = {
  id: null,
  email: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.id = null;
      state.email = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
