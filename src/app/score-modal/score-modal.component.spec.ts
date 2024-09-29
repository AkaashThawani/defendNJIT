import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreModalComponent } from './score-modal.component';

describe('ScoreModalComponent', () => {
  let component: ScoreModalComponent;
  let fixture: ComponentFixture<ScoreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
