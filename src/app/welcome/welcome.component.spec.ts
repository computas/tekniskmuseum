import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';
import { SpeechService } from '../services/speech.service';
import { SpeechServiceMock } from '../services/speech.service.mock';
describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SpeechService, useValue: SpeechServiceMock }],
      declarations: [WelcomeComponent],
      imports: [MaterialImportsModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
