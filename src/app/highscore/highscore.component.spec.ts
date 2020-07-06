import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighScoreComponent } from './highscore.component';
import { HighScoreSideNavComponent } from './highscore-side-nav/highscore-side-nav.component';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';

describe('HighscoreComponent', () => {
  let component: HighScoreComponent;
  let fixture: ComponentFixture<HighScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HighScoreComponent, HighScoreSideNavComponent],
      imports: [MaterialImportsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
