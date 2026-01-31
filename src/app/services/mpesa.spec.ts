import { TestBed } from '@angular/core/testing';

import { Mpesa } from './mpesa';

describe('Mpesa', () => {
  let service: Mpesa;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mpesa);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
