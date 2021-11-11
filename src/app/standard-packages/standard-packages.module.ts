import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StandardPackagesRoutingModule } from './standard-packages-routing.module';
import { StandardPackagesComponent } from './standard-packages.component';


@NgModule({
  declarations: [
    StandardPackagesComponent
  ],
  imports: [
    CommonModule,
    StandardPackagesRoutingModule
  ]
})
export class StandardPackagesModule { }
