import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDialogComponent } from './product-dialog.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ProductDialogComponent],
  imports: [
    CommonModule, DropdownModule, InputTextModule, FormsModule
  ],
  exports: [ProductDialogComponent]
})
export class ProductDialogModule { }
