import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'standard-packages',
    loadChildren: () =>
      import('./standard-packages/standard-packages.module').then(
        (m) => m.StandardPackagesModule
      ),
  },
  {
    path: 'elite-packages',
    loadChildren: () =>
      import('./elite-packages/elite-packages.module').then(
        (m) => m.ElitePackagesModule
      ),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./about/about.module').then((m) => m.AboutModule),
  },
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
