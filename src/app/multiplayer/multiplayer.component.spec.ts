import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayerComponent } from './multiplayer.component';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';

describe('MultiplayerComponent', () => {
  let component: MultiplayerComponent;
  let fixture: ComponentFixture<MultiplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialImportsModule],
      declarations: [MultiplayerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
