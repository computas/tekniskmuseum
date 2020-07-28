import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MultiplayerComponent } from './multiplayer.component';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';

describe('MultiplayerComponent', () => {
  let component: MultiplayerComponent;
  let fixture: ComponentFixture<MultiplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialImportsModule, RouterTestingModule, HttpClientTestingModule],
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
