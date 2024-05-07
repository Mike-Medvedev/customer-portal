import { CanActivateFn } from '@angular/router';

export const landingGuard: CanActivateFn = (route, state) => {
  return true;
};
