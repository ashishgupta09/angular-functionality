import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinCreation } from './join-creation';

describe('JoinCreation', () => {
  let component: JoinCreation;
  let fixture: ComponentFixture<JoinCreation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinCreation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinCreation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
