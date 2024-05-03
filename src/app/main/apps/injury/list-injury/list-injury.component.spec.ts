import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInjuryComponent } from './list-injury.component';

describe('ListInjuryComponent', () => {
  let component: ListInjuryComponent;
  let fixture: ComponentFixture<ListInjuryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInjuryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInjuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
