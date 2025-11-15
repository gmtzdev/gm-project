import { TestBed } from '@angular/core/testing';

import { AddDebtpaymentModalService } from './add-debtpayment-modal.service';

describe('AddDebtpaymentModalService', () => {
  let service: AddDebtpaymentModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddDebtpaymentModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
