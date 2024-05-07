import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { MenuGuard } from './guards/menu.guard';
import { OnboardFormsComponent } from './onboard-forms/onboard-forms.component';
import { AuthComponent } from './auth/auth.component';
import { AuthsGuard } from './guards/auth.guard';
import { PrelimFormComponent } from './prelim-form/prelim-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent, canActivate: [MenuGuard] },
  { path: 'onboarding', component: OnboardFormsComponent },
  { path: 'prelim', component: PrelimFormComponent, canActivate: [AuthsGuard] },
  {
    path: '',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
