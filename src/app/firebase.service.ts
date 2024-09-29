import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private firestore: Firestore) { }

  getLeaderboardData(): Observable<any[]> {
    const dataRef = collection(this.firestore, 'leaderboards');
    return collectionData(dataRef);
  }

  addLeaderboardData(newData: any) {
    const dataRef = collection(this.firestore, 'leaderboard');
    return addDoc(dataRef, newData);
  }

  getQUizData(): Observable<any[]> {
    const dataRef = collection(this.firestore, 'quiz');
    return collectionData(dataRef);
  }

  saveQuizData(newData: any) {
    const dataRef = collection(this.firestore, 'leaderboards');
    return addDoc(dataRef, newData);
  }

  storeUserData(userData: any) {
    const dataRef = collection(this.firestore, 'users');
    return addDoc(dataRef, userData);
  }
}
