import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationItemComponent } from './organization-item.component';

describe('OrganizationItemComponent', () => {
  let component: OrganizationItemComponent;
  let fixture: ComponentFixture<OrganizationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
