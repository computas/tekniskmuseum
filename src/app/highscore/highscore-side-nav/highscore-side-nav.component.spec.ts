import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighScoreSideNavComponent } from './highscore-side-nav.component';
import { MaterialImportsModule } from '../../shared/material-imports/material-imports.module';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HighscoreSideNavComponent', () => {
  let component: HighScoreSideNavComponent;
  let fixture: ComponentFixture<HighScoreSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HighScoreSideNavComponent],
      imports: [MaterialImportsModule, FormsModule, HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighScoreSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
