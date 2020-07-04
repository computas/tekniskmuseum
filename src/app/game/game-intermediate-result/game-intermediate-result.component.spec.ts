import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameIntermediateResultComponent } from './game-intermediate-result.component';

describe('GameIntermediateResultComponent', () => {
  let component: GameIntermediateResultComponent;
  let fixture: ComponentFixture<GameIntermediateResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameIntermediateResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameIntermediateResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
