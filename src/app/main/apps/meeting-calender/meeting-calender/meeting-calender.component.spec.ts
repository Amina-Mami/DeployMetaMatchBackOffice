import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingCalenderComponent } from './meeting-calender.component';

describe('MeetingCalenderComponent', () => {
  let component: MeetingCalenderComponent;
  let fixture: ComponentFixture<MeetingCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingCalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
