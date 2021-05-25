import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldCountriesComponent } from './world-countries.component';

describe('WorldCountriesComponent', () => {
  let component: WorldCountriesComponent;
  let fixture: ComponentFixture<WorldCountriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorldCountriesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
