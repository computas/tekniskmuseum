import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStepComponent } from './game-step.component';

describe('GameStepComponent', () => {
  let component: GameStepComponent;
  let fixture: ComponentFixture<GameStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
