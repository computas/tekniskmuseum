import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GameDrawComponent } from './game-draw.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialImportsModule } from '../../shared/material-imports/material-imports.module';

describe('DrawingComponent', () => {
  let component: GameDrawComponent;
  let fixture: ComponentFixture<GameDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameDrawComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialImportsModule,
      ],
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
