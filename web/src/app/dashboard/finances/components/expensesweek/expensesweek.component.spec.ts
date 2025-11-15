import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesweekComponent } from './expensesweek.component';

describe('ExpensesweekComponent', () => {
  let component: ExpensesweekComponent;
  let fixture: ComponentFixture<ExpensesweekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesweekComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpensesweekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
