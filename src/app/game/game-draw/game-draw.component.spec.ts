import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GameDrawComponent } from './game-draw.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialImportsModule } from '../../shared/material-imports/material-imports.module';
import { SpeechServiceMock } from 'src/app/services/speech.service.mock';
import { SpeechService } from 'src/app/services/speech.service';

describe('DrawingComponent', () => {
  let component: GameDrawComponent;
  let fixture: ComponentFixture<GameDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameDrawComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MaterialImportsModule],
      providers: [{ provide: SpeechService, useValue: SpeechServiceMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
