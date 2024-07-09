import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SplashComponent {
    private headerClicks = 0;
    
    constructor(private router: Router) { }
    
    navigateToWelcome() {
        this.router.navigate(['/welcome']);
    }
}
