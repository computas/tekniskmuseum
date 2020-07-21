import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';

import { GameModeComponent } from './game-mode.component';

describe('GameModeComponent', () => {
  let component: GameModeComponent;
  let fixture: ComponentFixture<GameModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialImportsModule],
      declarations: [GameModeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
