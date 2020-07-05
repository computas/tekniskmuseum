import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameWordToDrawComponent } from './game-word-to-draw.component';

describe('GameWordToDrawComponent', () => {
  let component: GameWordToDrawComponent;
  let fixture: ComponentFixture<GameWordToDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameWordToDrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameWordToDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
