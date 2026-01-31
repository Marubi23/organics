import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityFeatures } from './security-features';

describe('SecurityFeatures', () => {
  let component: SecurityFeatures;
  let fixture: ComponentFixture<SecurityFeatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityFeatures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityFeatures);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
