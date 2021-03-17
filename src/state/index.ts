import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import user from "state/user";
import { updateVersion } from "state/global";

const store = configureStore({
  reducer: {
    user,
  },
  middleware: [...getDefaultMiddleware({ thunk: false })],
});

store.dispatch(updateVersion());

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
