import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthsGuard } from './guards/auth.guard';
import { PrelimFormComponent } from './prelim-form/prelim-form.component';

const routes: Routes = [
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
