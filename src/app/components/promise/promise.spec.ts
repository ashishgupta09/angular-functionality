import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Promise } from './promise';

describe('Promise', () => {
  let component: Promise;
  let fixture: ComponentFixture<Promise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Promise]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Promise);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
