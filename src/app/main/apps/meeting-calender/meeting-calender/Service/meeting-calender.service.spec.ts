import { TestBed } from '@angular/core/testing';

import { MeetingCalenderService } from './meeting-calender.service';

describe('MeetingCalenderService', () => {
  let service: MeetingCalenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingCalenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
