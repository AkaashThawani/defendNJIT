import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent {
  users = [4, 5, 6, 7, 8, 9, 10];

  constructor(private fireService: FirebaseService) { }

  ngOnInit(): void {
    this.fireService.getLeaderboardData().subscribe(data => {
      console.log(data);
    });
  }
}
