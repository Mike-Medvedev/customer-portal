import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TokenState } from './token.reducer';

export const selectTokenState = createFeatureSelector<TokenState>('token');

export const selectAccessToken = createSelector(selectTokenState, (state) => state.accessToken);
export const selectRefreshToken = createSelector(selectTokenState, (state) => state.refreshToken);
