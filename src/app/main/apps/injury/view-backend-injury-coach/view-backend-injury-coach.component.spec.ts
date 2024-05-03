import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBackendInjuryCoachComponent } from './view-backend-injury-coach.component';

describe('ViewBackendInjuryCoachComponent', () => {
  let component: ViewBackendInjuryCoachComponent;
  let fixture: ComponentFixture<ViewBackendInjuryCoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBackendInjuryCoachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBackendInjuryCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
