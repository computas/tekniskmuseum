import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialImportsModule } from '../../shared/material-imports/material-imports.module';

import { GameIntermediateResultComponent } from './game-intermediate-result.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GameIntermediateResultComponent', () => {
  let component: GameIntermediateResultComponent;
  let fixture: ComponentFixture<GameIntermediateResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameIntermediateResultComponent],
      imports: [HttpClientTestingModule, MaterialImportsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameIntermediateResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* it('should create', () => {
    expect(component).toBeTruthy();
  }); */
});
