import { Routes } from '@angular/router';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { NjitModelComponent } from './njit-model/njit-model.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'game',
        component: NjitModelComponent
    },
    {
        path: 'leaderboard',
        component: LeaderboardComponent
    }

];
