import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayageComponent } from './payage.component';

describe('TableListComponent', () => {
  let component: PayageComponent;
  let fixture: ComponentFixture<PayageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
