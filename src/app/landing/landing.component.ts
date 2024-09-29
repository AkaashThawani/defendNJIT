import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { NjitModelComponent } from '../njit-model/njit-model.component';
import { AuthzeroService } from '../authzero.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NjitModelComponent, HeaderComponent, MatSidenavModule, MatIconModule, MatToolbarModule, MatButtonModule, MatMenuModule, LandingComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  public loggedIn = false;
  constructor(private router: Router, private authzero: AuthzeroService) {
    this.authzero.isLoggedIn.subscribe((loggedIn) => { this.loggedIn = loggedIn; })
  }


  goToLeaderBoard() {
    this.router.navigate(['leaderboard']);
  }
  goToPlay() {
    this.router.navigate(['game']);
  }

  logOut() {
    this.authzero.logout();
  }
}

