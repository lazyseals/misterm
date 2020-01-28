import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPanelResponsiveComponent } from './filter-panel-responsive.component';

describe('FilterPanelResponsiveComponent', () => {
  let component: FilterPanelResponsiveComponent;
  let fixture: ComponentFixture<FilterPanelResponsiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterPanelResponsiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPanelResponsiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
