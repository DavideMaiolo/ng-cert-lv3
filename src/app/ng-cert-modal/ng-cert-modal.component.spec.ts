import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgCertModalComponent } from './ng-cert-modal.component';

describe('NgCertModalComponent', () => {
  let component: NgCertModalComponent;
  let fixture: ComponentFixture<NgCertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgCertModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgCertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
