import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) }, { path: 'donate', loadChildren: () => import('./donate/donate.module').then(m => m.DonateModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
