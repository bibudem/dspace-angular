import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTopUdemComponent } from './navbar-top-udem.component';

describe('NavbarTopUdemComponent', () => {
  let component: NavbarTopUdemComponent;
  let fixture: ComponentFixture<NavbarTopUdemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarTopUdemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarTopUdemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
