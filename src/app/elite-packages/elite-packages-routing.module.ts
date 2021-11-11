import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElitePackagesComponent } from './elite-packages.component';

const routes: Routes = [{ path: '', component: ElitePackagesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElitePackagesRoutingModule { }
