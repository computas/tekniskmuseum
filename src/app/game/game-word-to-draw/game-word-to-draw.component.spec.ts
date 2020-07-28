import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameWordToDrawComponent } from './game-word-to-draw.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('GameWordToDrawComponent', () => {
  let component: GameWordToDrawComponent;
  let fixture: ComponentFixture<GameWordToDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameWordToDrawComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameWordToDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /*
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  */
});
