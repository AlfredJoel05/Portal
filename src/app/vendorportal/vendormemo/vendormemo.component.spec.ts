import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendormemoComponent } from './vendormemo.component';

describe('VendormemoComponent', () => {
  let component: VendormemoComponent;
  let fixture: ComponentFixture<VendormemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendormemoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendormemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
