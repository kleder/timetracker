import { TestBed, inject } from '@angular/core/testing';

import { ToasterService } from './toaster-service.service';

describe('ToasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToasterService]
    });
  });

  it('should be created', inject([ToasterService], (service: ToasterService) => {
    expect(service).toBeTruthy();
  }));
});
