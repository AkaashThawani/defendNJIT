import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule,MatIconModule,MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation:ViewEncapsulation.None  
})
export class HeaderComponent {

}
