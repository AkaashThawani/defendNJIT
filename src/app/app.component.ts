import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NjitModelComponent } from "./njit-model/njit-model.component";
import { HeaderComponent } from "./header/header.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { LandingComponent } from "./landing/landing.component";
import { AuthzeroService } from './authzero.service';
import { userData } from 'three/webgpu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NjitModelComponent, HeaderComponent, MatSidenavModule, MatIconModule, MatToolbarModule, MatButtonModule, MatMenuModule, LandingComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'defendNJIT';

  constructor(private router: Router, private authZero: AuthzeroService) {
    if (window.location.hash) {
      this.authZero.handleAuthentication(); // Call the method to handle Auth0 response
    }
    let userData: any = sessionStorage.getItem('userData')
    userData = JSON.parse(userData);
    if (userData?.loggedIn) {
      console.log('User is logged in');
      this.authZero.setLoggedIn(true);
    }
  }



  goToLeaderBoard() {
    this.router.navigate(['leaderboard']);
  }
  goToPlay() {
    this.router.navigate(['game']);
  }
}
