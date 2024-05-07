import { createAction, props } from '@ngrx/store';

export const setAccessToken = createAction('[Token] Set Access Token', props<{ accessToken: string }>());
export const setRefreshToken = createAction('[Token] Set Refresh Token', props<{ refreshToken: string }>());
export const verifyTokens = createAction('[Token] Verify Tokens');
export const tokensVerified = createAction('[Token] Tokens Verified');
export const tokensVerificationFailed = createAction('[Token] Tokens Verification Failed');
