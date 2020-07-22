import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { IdleTimeoutComponent } from './idle-timeout.component';


describe('IdleTimeoutComponent', () => {
  let component: IdleTimeoutComponent;
  let fixture: ComponentFixture<IdleTimeoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IdleTimeoutComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdleTimeoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
