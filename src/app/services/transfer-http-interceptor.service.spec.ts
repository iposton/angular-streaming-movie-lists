import { TestBed } from '@angular/core/testing';

import { TransferHttpInterceptorService } from './transfer-http-interceptor.service';

describe('TransferHttpInterceptorService', () => {
  let service: TransferHttpInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferHttpInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
