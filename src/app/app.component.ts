import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NjitModelComponent } from "./njit-model/njit-model.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NjitModelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'defendNJIT';
}
