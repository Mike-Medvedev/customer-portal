import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrelimFormComponent } from './prelim-form.component';
import { StepsModule } from 'primeng/steps';
import { PhoneLinkModule } from '../shared/phone-link/phone-link.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenTimerModule } from '../token-timer/token-timer.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuModule } from 'primeng/menu';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ProductDialogModule } from '../shared/product-dialog/product-dialog.module';





@NgModule({
  declarations: [PrelimFormComponent],
  imports: [
    CommonModule, StepsModule, PhoneLinkModule, ReactiveFormsModule,
     TokenTimerModule, SelectButtonModule, RadioButtonModule, CheckboxModule, MenuModule, ClipboardModule, TooltipModule,
     DropdownModule, ConfirmDialogModule, DynamicDialogModule, ProductDialogModule
  ],
  exports: [PrelimFormComponent]
})
export class PrelimFormModule { }
