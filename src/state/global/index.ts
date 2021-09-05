import { createReducer, createAction } from "@reduxjs/toolkit";

// Typings
export enum Page {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  MINE = "mine",
  REDEEM = "redeem",
  EXCHANGE = "swap",
  COMPLIANCE = "report",
  AIRDROP = "airdrop",
  STAKE = "stake",
  REFUND = "refund",

  SETUP = "account",
  SETUP_CREATE = "account/create",
}

interface GlobalState {
  readonly currentPage?: Page;
}

const initialState: GlobalState = {
  currentPage: Page.EXCHANGE,
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
