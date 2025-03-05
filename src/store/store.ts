import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { sessionService, usersChatsService, usersService } from "@/services";
import userReducer from "./reducers/userSlice";

const rootReducer = combineReducers({
  userReducer,
  [sessionService.reducerPath]: sessionService.reducer,
  [usersChatsService.reducerPath]: usersChatsService.reducer,
  [usersService.reducerPath]: usersService.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      sessionService.middleware,
      usersChatsService.middleware,
      usersService.middleware
    ),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
