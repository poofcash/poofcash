import {createReducer, createAction} from '@reduxjs/toolkit'

// Typings
interface UserState {
  readonly account?: string
}

const initialState: UserState = {}

// Actions
export const setAccount = createAction<{account: string}>('user/setAccount')

// Reducer
export default createReducer(initialState, builder =>
  builder
    .addCase(setAccount, (state, action) => {
      const {account} = action.payload
      return {...state, account}
    })
)

