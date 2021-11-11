import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElitePackagesRoutingModule } from './elite-packages-routing.module';
import { ElitePackagesComponent } from './elite-packages.component';


@NgModule({
  declarations: [
    ElitePackagesComponent
  ],
  imports: [
    CommonModule,
    ElitePackagesRoutingModule
  ]
})
export class ElitePackagesModule { }
