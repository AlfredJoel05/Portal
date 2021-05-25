import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Masterdata } from './masterdata.component';

describe('NotificationsComponent', () => {
  let component: Masterdata;
  let fixture: ComponentFixture<Masterdata>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Masterdata ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Masterdata);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
