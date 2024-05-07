import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenTimerComponent } from './token-timer.component';



@NgModule({
  declarations: [TokenTimerComponent],
  imports: [
    CommonModule
  ],
  exports: [TokenTimerComponent]
})
export class TokenTimerModule { }
