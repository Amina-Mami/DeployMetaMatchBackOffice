import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsArchivesComponent } from './views-archives.component';

describe('ViewsArchivesComponent', () => {
  let component: ViewsArchivesComponent;
  let fixture: ComponentFixture<ViewsArchivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewsArchivesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
