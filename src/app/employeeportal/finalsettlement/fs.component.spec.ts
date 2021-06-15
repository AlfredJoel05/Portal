import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalSettleComponent } from './fs.component';

describe('FinalSettleComponent', () => {
  let component: FinalSettleComponent;
  let fixture: ComponentFixture<FinalSettleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalSettleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalSettleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
