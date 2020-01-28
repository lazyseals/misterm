import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavRegularComponent } from './nav-regular.component';

describe('NavRegularComponent', () => {
  let component: NavRegularComponent;
  let fixture: ComponentFixture<NavRegularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavRegularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavRegularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
