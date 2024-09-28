import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NjitModelComponent } from './njit-model.component';

describe('NjitModelComponent', () => {
  let component: NjitModelComponent;
  let fixture: ComponentFixture<NjitModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NjitModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NjitModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
