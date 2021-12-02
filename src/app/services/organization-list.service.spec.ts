import { TestBed } from '@angular/core/testing';

import { OrganizationListService } from './organization-list.service';

describe('OrganizationListService', () => {
  let service: OrganizationListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
