import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeComponent],
      imports: [MaterialImportsModule, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
