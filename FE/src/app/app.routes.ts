import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MatchComponent} from './pages/match/match.component';
import {LeagueComponent} from './pages/league/league.component';
import {TeamComponent} from './pages/team/team.component';
import {RegisterComponent} from './pages/register/register.component';
import {LoginComponent} from './pages/login/login.component';
import {AuthGuard} from './guards/auth.guard';
import {UserComponent} from './pages/user/user.component';
import {PlayerComponent} from './pages/player/player.component';
import {SearchComponent} from './pages/search/search.component';
import {ComparisonComponent} from './pages/comparison/comparison.component';
import {NewUserComponent} from './pages/new-user/new-user.component';

export const router: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'user', component: UserComponent },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'comparison', component: ComparisonComponent, canActivate: [AuthGuard] },
  { path: 'team/:source_and_id', component: TeamComponent, canActivate: [AuthGuard] },
  { path: 'team', component: TeamComponent, canActivate: [AuthGuard] },
  { path: 'league/:source_and_id', component: LeagueComponent, canActivate: [AuthGuard] },
  { path: 'league', component: LeagueComponent, canActivate: [AuthGuard] },
  { path: 'player/:source_and_id', component: PlayerComponent, canActivate: [AuthGuard] },
  { path: 'player', component: PlayerComponent, canActivate: [AuthGuard] },
  { path: 'match', component: MatchComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'new-user', component: NewUserComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'data' }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
