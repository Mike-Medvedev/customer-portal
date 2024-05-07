import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardFormsComponent } from './onboard-forms.component';

describe('OnboardFormsComponent', () => {
  let component: OnboardFormsComponent;
  let fixture: ComponentFixture<OnboardFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardFormsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
