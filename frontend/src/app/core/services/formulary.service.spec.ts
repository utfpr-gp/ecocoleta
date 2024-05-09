import { TestBed } from '@angular/core/testing';

import { FormularyService } from './formulary.service';

describe('FormularyService', () => {
  let service: FormularyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormularyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
