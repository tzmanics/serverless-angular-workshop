import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardPackagesComponent } from './standard-packages.component';

describe('StandardPackagesComponent', () => {
  let component: StandardPackagesComponent;
  let fixture: ComponentFixture<StandardPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardPackagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
