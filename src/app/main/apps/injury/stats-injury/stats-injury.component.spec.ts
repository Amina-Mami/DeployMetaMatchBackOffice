import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsInjuryComponent } from './stats-injury.component';

describe('StatsInjuryComponent', () => {
  let component: StatsInjuryComponent;
  let fixture: ComponentFixture<StatsInjuryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsInjuryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsInjuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
