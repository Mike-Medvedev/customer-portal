import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginModule } from './login/login.module';
import { MenuModule } from './menu/menu.module';
// import { AuthInterceptor } from './interceptor/auth-interceptor';
import { FormBuilderModule } from './shared/form-builder/form-builder.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { OnboardFormsModule } from './onboard-forms/onboard-forms.module';
import { AuthModule } from './auth/auth.module';
import { PrelimFormModule } from './prelim-form/prelim-form.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule,
    MenuModule,
    FormBuilderModule,
    BrowserAnimationsModule,
    ButtonModule,
    OnboardFormsModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    EffectsModule.forRoot([]),
  ],

  //   providers: [
  //     {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: AuthInterceptor,
  //     multi: true
  //   }
  // ],
  bootstrap: [AppComponent],
})
export class AppModule {}
