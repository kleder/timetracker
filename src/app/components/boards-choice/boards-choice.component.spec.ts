import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardsChoiceComponent } from './boards-choice.component';

describe('LoginComponent', () => {
  let component: BoardsChoiceComponent;
  let fixture: ComponentFixture<BoardsChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardsChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardsChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
