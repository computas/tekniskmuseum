import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { GameInfoComponent } from './game-info.component';
import { MaterialImportsModule } from '../../shared/material-imports/material-imports.module';
import { SpeechServiceMock } from 'src/app/services/speech.service.mock';
import { SpeechService } from 'src/app/services/speech.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GameInfoComponent', () => {
  let component: GameInfoComponent;
  let fixture: ComponentFixture<GameInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MaterialImportsModule, HttpClientTestingModule],
      declarations: [GameInfoComponent],
      providers: [{ provide: SpeechService, useValue: SpeechServiceMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
