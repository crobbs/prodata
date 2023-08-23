import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatFormComponent } from './sat-form.component';

describe('SatFormComponent', () => {
  let component: SatFormComponent;
  let fixture: ComponentFixture<SatFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SatFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
