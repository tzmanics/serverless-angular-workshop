import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonateRoutingModule } from './donate-routing.module';
import { DonateComponent } from './donate.component';
import { OrganizationItemComponent } from '../../components/organization-item/organization-item.component';

@NgModule({
  declarations: [DonateComponent, OrganizationItemComponent],
  imports: [CommonModule, DonateRoutingModule],
})
export class DonateModule {}
