import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutAuthorsComponent } from './about-trec.component';

describe('AboutAuthorsComponent', () => {
  let component: AboutAuthorsComponent;
  let fixture: ComponentFixture<AboutAuthorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutAuthorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutAuthorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
