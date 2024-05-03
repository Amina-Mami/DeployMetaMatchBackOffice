import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInjuryPhysoComponent } from './list-injury-physo.component';

describe('ListInjuryPhysoComponent', () => {
  let component: ListInjuryPhysoComponent;
  let fixture: ComponentFixture<ListInjuryPhysoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInjuryPhysoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInjuryPhysoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
