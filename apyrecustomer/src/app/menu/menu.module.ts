import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PhoneLinkModule } from '../shared/phone-link/phone-link.module';



@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule, ReactiveFormsModule, PhoneLinkModule
  ],
  exports: [MenuComponent]
})
export class MenuModule { }
