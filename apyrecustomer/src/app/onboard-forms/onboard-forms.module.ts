import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardFormsComponent } from './onboard-forms.component';
import { FormBuilderModule } from '../shared/form-builder/form-builder.module';
import { StepsModule } from 'primeng/steps';
import { PhoneLinkModule } from '../shared/phone-link/phone-link.module';




@NgModule({
  declarations: [OnboardFormsComponent],
  imports: [
    CommonModule, FormBuilderModule, StepsModule, PhoneLinkModule
  ],
  exports: [OnboardFormsComponent]
})
export class OnboardFormsModule { }
