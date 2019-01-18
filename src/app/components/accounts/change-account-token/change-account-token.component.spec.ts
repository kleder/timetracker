import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAccountTokenComponent } from './change-account-token.component';

describe('ChangeAccountTokenComponent', () => {
  let component: ChangeAccountTokenComponent;
  let fixture: ComponentFixture<ChangeAccountTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeAccountTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAccountTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
