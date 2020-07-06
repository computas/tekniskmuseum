import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighscoreSideNavComponent } from './highscore-side-nav.component';

describe('HighscoreSideNavComponent', () => {
  let component: HighscoreSideNavComponent;
  let fixture: ComponentFixture<HighscoreSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HighscoreSideNavComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighscoreSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
