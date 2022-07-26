import { TestBed } from '@angular/core/testing';

import { VeevaService } from './veeva.service';

describe('VeevaService', () => {
  let service: VeevaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VeevaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
