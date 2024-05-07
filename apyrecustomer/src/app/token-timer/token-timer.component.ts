import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-token-timer',
  template: `<div *ngIf="countdown">
  <p>Token expires in: <br> {{ countdown.minutes }} minutes, {{ countdown.seconds }} seconds</p>
</div>`,
styles:   `p {text-align: center}`
})
export class TokenTimerComponent {
  @Input() expirationTimeUnix!: number;

  private countdownInterval: any;
  public countdown!: { minutes: number, seconds: number };

  constructor() { }

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }

  private startCountdown(): void {
    this.updateCountdown(); // Initial update

    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  private updateCountdown(): void {
    const currentTime = Date.now();

  const remainingTime = this.expirationTimeUnix * 1000 - currentTime;

    if (remainingTime <= 0) {
      clearInterval(this.countdownInterval);
      this.countdown = { minutes: 0, seconds: 0 };
    } else {
      const remainingSeconds = Math.floor(remainingTime / 1000);
      this.countdown = {
        minutes: Math.floor((remainingSeconds % 3600) / 60),
        seconds: remainingSeconds % 60
      };
    }
  }
}
