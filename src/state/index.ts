import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import user from "state/user";
import global from "state/global";

const store = configureStore({
  reducer: {
    user,
    global,
  },
  middleware: [...getDefaultMiddleware({ thunk: false })],
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
