import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Multicasting } from './multicasting';

describe('Multicasting', () => {
  let component: Multicasting;
  let fixture: ComponentFixture<Multicasting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Multicasting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Multicasting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
