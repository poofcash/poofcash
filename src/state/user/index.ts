import { createReducer, createAction } from "@reduxjs/toolkit";
import { EncryptedKeystoreV3Json } from "web3-core";

// Typings
interface UserState {
  readonly poofAccount?: EncryptedKeystoreV3Json;
}

const initialState: UserState = {};

// Actions
export const setAccount = createAction<{
  poofAccount?: EncryptedKeystoreV3Json;
}>("user/setAccount");

// Reducer
export default createReducer(initialState, (builder) =>
  builder.addCase(setAccount, (state, action) => {
    const { poofAccount } = action.payload;
    return { ...state, poofAccount };
  })
);
