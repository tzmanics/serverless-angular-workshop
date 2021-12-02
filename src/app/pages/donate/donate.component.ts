import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { OrganizationListService } from '../../services/organization-list.service';
import { Organization } from '../../models/Organization';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css'],
})
export class DonateComponent implements OnInit {
  organizationList!: Observable<Organization[]>;
  constructor(private organizationListService: OrganizationListService) {}

  ngOnInit(): void {
    this.organizationList = this.organizationListService.getOrganizationList();
  }
}
