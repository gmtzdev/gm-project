import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcontributionModalComponent } from './addcontribution-modal.component';

describe('AddcontributionModalComponent', () => {
  let component: AddcontributionModalComponent;
  let fixture: ComponentFixture<AddcontributionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddcontributionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddcontributionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
