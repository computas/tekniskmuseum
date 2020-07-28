import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';

import { GameModeComponent } from './game-mode.component';
import { SpeechService } from '../services/speech.service';
import { SpeechServiceMock } from '../services/speech.service.mock';

describe('GameModeComponent', () => {
  let component: GameModeComponent;
  let fixture: ComponentFixture<GameModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialImportsModule],
      declarations: [GameModeComponent],
      providers: [{ provide: SpeechService, useValue: SpeechServiceMock }],
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
