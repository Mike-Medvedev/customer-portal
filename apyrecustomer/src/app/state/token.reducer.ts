import { createReducer, on } from '@ngrx/store';
import * as TokenActions from './token.actions';

export interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
}

export const initialState: TokenState = {
  accessToken: null,
  refreshToken: null,
};

export const tokenReducer = createReducer(
  initialState,
  on(TokenActions.setAccessToken, (state, { accessToken }) => ({
    ...state,
    accessToken,
  })),
  on(TokenActions.setRefreshToken, (state, { refreshToken }) => ({
    ...state,
    refreshToken,
  })),
);
