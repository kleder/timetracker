import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTrecComponent } from './about-trec.component';

describe('AboutTrecComponent', () => {
  let component: AboutTrecComponent;
  let fixture: ComponentFixture<AboutTrecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutTrecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTrecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
