import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';
import { GameInfoComponent } from './game-info/game-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HighScoreModule } from '../highscore/highscore.module';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameComponent, GameInfoComponent],
      imports: [MaterialImportsModule, RouterTestingModule, HttpClientTestingModule, HighScoreModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /*
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  */
});
