import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayerComponent } from './multiplayer.component';

describe('MultiplayerComponent', () => {
  let component: MultiplayerComponent;
  let fixture: ComponentFixture<MultiplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiplayerComponent ]
    })
    .compileComponents();
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
