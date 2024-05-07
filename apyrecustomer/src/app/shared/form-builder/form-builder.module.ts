import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilderComponent } from './form-builder.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';



@NgModule({
  declarations: [FormBuilderComponent],
  imports: [
    CommonModule, ReactiveFormsModule, SelectButtonModule
  ],
  exports: [FormBuilderComponent]
})
export class FormBuilderModule { }
