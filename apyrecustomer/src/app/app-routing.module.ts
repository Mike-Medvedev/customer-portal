import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { MenuGuard } from './guards/menu.guard';
import { OnboardFormsComponent } from './onboard-forms/onboard-forms.component';
import { AuthComponent } from './auth/auth.component';
import { AuthsGuard } from './guards/auth.guard';
import { PrelimFormComponent } from './prelim-form/prelim-form.component';

const routes: Routes = [{ path: '', component: PrelimFormComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
