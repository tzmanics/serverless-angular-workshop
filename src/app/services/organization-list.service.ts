import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Organization } from '../models/Organization';

@Injectable({
  providedIn: 'root',
})
export class OrganizationListService {
  constructor(private http: HttpClient) {}

  getOrganizationList(): Observable<Organization[]> {
    return this.http.get<Organization[]>('/.netlify/functions/getOrgs', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
