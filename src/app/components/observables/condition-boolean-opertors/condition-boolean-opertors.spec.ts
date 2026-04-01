import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionBooleanOpertors } from './condition-boolean-opertors';

describe('ConditionBooleanOpertors', () => {
  let component: ConditionBooleanOpertors;
  let fixture: ComponentFixture<ConditionBooleanOpertors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConditionBooleanOpertors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConditionBooleanOpertors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
