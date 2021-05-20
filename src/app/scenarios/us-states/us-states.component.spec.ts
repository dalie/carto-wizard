import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsStatesComponent } from './us-states.component';

describe('UsStatesComponent', () => {
  let component: UsStatesComponent;
  let fixture: ComponentFixture<UsStatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsStatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
