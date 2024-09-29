import { TestBed } from '@angular/core/testing';

import { AuthzeroService } from './authzero.service';

describe('AuthzeroService', () => {
  let service: AuthzeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthzeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
