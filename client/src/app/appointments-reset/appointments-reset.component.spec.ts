import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsResetComponent } from './appointments-reset.component';

describe('AppointmentsResetComponent', () => {
  let component: AppointmentsResetComponent;
  let fixture: ComponentFixture<AppointmentsResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsResetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
