import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShotChart} from "./charts/shot/shot.chart";


export const router: Routes = [
  { path: '', redirectTo: 'shot', pathMatch: 'full' },
  { path: 'shot', component: ShotChart },
  { path: '**', redirectTo: 'shot' }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
