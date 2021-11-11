import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElitePackagesComponent } from './elite-packages.component';

describe('ElitePackagesComponent', () => {
  let component: ElitePackagesComponent;
  let fixture: ComponentFixture<ElitePackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElitePackagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElitePackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
