import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StandardPackagesComponent } from './standard-packages.component';

const routes: Routes = [{ path: '', component: StandardPackagesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StandardPackagesRoutingModule { }
