import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// import { AppModule } from "../app.module";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  startGame() {
    this.router.navigateByUrl('/drawing');
  }
}
