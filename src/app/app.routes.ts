import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './guard/auth.guard';
import { ProfilComponent } from './profil/profil.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'auth', component: AuthComponent },
  { path: 'profil', component: ProfilComponent },
  { path: '**', redirectTo: 'home' }
];
