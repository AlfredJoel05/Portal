import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAdminLayoutComponent } from './eadmin-layout.component';

describe('EmployeeAdminLayoutComponent', () => {
  let component: EmployeeAdminLayoutComponent;
  let fixture: ComponentFixture<EmployeeAdminLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAdminLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
