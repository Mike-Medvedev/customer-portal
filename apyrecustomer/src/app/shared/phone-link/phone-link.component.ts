import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-phone-link',
  template: `<a href="tel:{{ link }}" class="phone-link">{{ link }}</a>`,
  styles: [
    `
      .phone-link {
        color: var(--primaryColor, #a24399);
      }

      .phone-link:hover {
        color: var(--primary-500, #692b63);
      }
    `,
  ],
})
export class PhoneLinkComponent {
  @Input() link!: string;
  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.stopPropagation();
  }
}
