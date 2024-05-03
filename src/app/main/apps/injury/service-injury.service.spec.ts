import { TestBed } from '@angular/core/testing';

import { ServiceInjury } from './service-injury.service';

describe('ServiceInjury', () => {
  let service: ServiceInjury;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceInjury);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
