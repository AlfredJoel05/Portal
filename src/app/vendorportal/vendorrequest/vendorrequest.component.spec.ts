import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorrequestComponent } from './vendorrequest.component';

describe('VendorrequestComponent', () => {
  let component: VendorrequestComponent;
  let fixture: ComponentFixture<VendorrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
