import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomesyearComponent } from './incomesyear.component';

describe('IncomesyearComponent', () => {
  let component: IncomesyearComponent;
  let fixture: ComponentFixture<IncomesyearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomesyearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncomesyearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
