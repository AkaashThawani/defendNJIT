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
  users: any = [4, 5, 6, 7, 8, 9, 10];
  first: any;
  second: any;
  third: any;

  constructor(private fireService: FirebaseService) { }

  ngOnInit(): void {
    this.fireService.getLeaderboardData().subscribe(data => {
      data.sort((a, b) => b.score - a.score);
      console.log(data);
      this.first = data[0];
      this.second = data[1];
      this.third = data[2];
      data = data.slice(3, 10);
      this.users = data;
    });
  }
}
