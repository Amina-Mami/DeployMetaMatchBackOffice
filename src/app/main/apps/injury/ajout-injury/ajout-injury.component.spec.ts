import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutInjuryComponent } from './ajout-injury.component';

describe('AjoutInjuryComponent', () => {
  let component: AjoutInjuryComponent;
  let fixture: ComponentFixture<AjoutInjuryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutInjuryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutInjuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
