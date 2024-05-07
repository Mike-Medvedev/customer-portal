import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneLinkComponent } from './phone-link.component';

describe('PhoneLinkComponent', () => {
  let component: PhoneLinkComponent;
  let fixture: ComponentFixture<PhoneLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
