import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Firestore, collection, query, where, getDocs, doc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
declare var auth0: any;

@Injectable({
  providedIn: 'root',
})
export class AuthzeroService {
  private auth0: any;
  public loggedIn = new BehaviorSubject<boolean>(false);

  setLoggedIn(logged): void {
    this.loggedIn.next(logged);
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  constructor(private firebase: FirebaseService, private firestore: Firestore, private router: Router) {
    this.auth0 = new auth0.WebAuth({
      domain: 'dev-14g8e4pnis8benle.us.auth0.com',
      clientID: 'nCycZ0b2rskf4Pz0niwEruAQyumONEKy',
      redirectUri: window.location.origin,
      responseType: 'token id_token',
      scope: 'openid profile email',
    });
  }

  login() {
    this.auth0.authorize(); // Redirects to Auth0 login page
  }

  handleAuthentication() {
    this.auth0.parseHash((err: any, authResult: any) => {
      if (err) {
        console.log(err);
        this.setLoggedIn(false);
        sessionStorage.removeItem('userData');
        return;
      }

      if (authResult && authResult.accessToken && authResult.idToken) {
        // Extract user data
        const userData = {
          accessToken: authResult.accessToken,
          idToken: authResult.idToken,
          loggedIn: true,
          expiresAt: authResult.expiresIn * 1000 + new Date().getTime(),
          email: authResult.idTokenPayload.email, // User email
          name: authResult.idTokenPayload.name, // User name
          profilePic: authResult.idTokenPayload.picture, // Profile picture URL
        };

        // Store user data in Firebase
        sessionStorage.setItem('userData', JSON.stringify(userData));
        this.storeUserData(userData);
        this.setLoggedIn(true);
      }
    });
  }

  async storeUserData(userData: any) {
    const usersRef = collection(this.firestore, 'users');

    // Check if user already exists
    const userQuery = query(usersRef, where('email', '==', userData.email));

    try {
      const querySnapshot = await getDocs(userQuery);
      if (querySnapshot.empty) {
        // User does not exist, add user data
        await this.firebase.storeUserData(userData);
        console.log('User data stored successfully:', userData);
      } else {
        console.log('User already exists in the database');
      }
      this.router.navigate(['game']);
    } catch (error) {
      console.error('Error checking user existence:', error);
    }
  }

  async markUserAsLoggedOut() {
    const email = JSON.parse(sessionStorage.getItem('userData')).email;
    if (email) {
      const userDocRef = doc(this.firestore, 'users', email); // Assuming you use email as the document ID
      try {
        await updateDoc(userDocRef, { loggedIn: false });
        console.log('User marked as logged out in Firebase:', email);
        this.setLoggedIn(false);
        sessionStorage.removeItem('userData');
        this.router.navigate(['']);
        this.auth0.logout();
      } catch (error) {
        console.error('Error marking user as logged out:', error);
      }
    } else {
      console.warn('No email found in local storage');
    }
  }

  logout() {
    this.markUserAsLoggedOut();
  }
}
