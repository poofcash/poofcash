import { createReducer, createAction } from "@reduxjs/toolkit";

// Typings
export enum Page {
  SETUP = "SETUP",
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  MINE = "MINE",
  REDEEM = "REDEEM",
  EXCHANGE = "EXCHANGE",
  COMPLIANCE = "COMPLIANCE",
  AIRDROP = "AIRDROP",
  STAKE = "STAKE",
}

interface GlobalState {
  readonly currentPage?: Page;
}

const initialState: GlobalState = {
  currentPage: Page.DEPOSIT,
};

// Actions
export const setCurrentPage = createAction<{ nextPage: Page }>(
  "global/setCurrentPage"
);

// Reducer
export default createReducer(initialState, (builder) =>
  builder.addCase(setCurrentPage, (state, action) => {
    const { nextPage } = action.payload;
    return { ...state, currentPage: nextPage };
  })
);
