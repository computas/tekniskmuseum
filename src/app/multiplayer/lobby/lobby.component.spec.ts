import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LobbyComponent } from './lobby.component';
import { MaterialImportsModule } from '../../shared/material-imports/material-imports.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WebSocketServiceMock } from '../services/web-socket.service.mock';
import { WebSocketService } from '../services/web-socket.service';

describe('LobbyComponent', () => {
  let component: LobbyComponent;
  let fixture: ComponentFixture<LobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialImportsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [LobbyComponent],
      providers: [{ provide: WebSocketService, useValue: WebSocketServiceMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /*
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  */
});
