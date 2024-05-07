import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrelimFormComponent } from './prelim-form.component';

describe('PrelimFormComponent', () => {
  let component: PrelimFormComponent;
  let fixture: ComponentFixture<PrelimFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrelimFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrelimFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
