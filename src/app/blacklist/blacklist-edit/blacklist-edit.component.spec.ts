import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistEditComponent } from './blacklist-edit.component';

describe('BlacklistEditComponent', () => {
  let component: BlacklistEditComponent;
  let fixture: ComponentFixture<BlacklistEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlacklistEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
