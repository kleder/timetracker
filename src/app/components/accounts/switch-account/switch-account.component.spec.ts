import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchAccountComponent } from './switch-account.component';

describe('SwitchAccountComponent', () => {
  let component: SwitchAccountComponent;
  let fixture: ComponentFixture<SwitchAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
