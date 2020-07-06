import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../shared/models/routes';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToGameInfoPage() {
    this.router.navigate([routes.PLAYGAME]);
  }
}
