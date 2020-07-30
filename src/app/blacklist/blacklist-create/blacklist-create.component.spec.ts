import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistCreateComponent } from './blacklist-create.component';

describe('BlacklistCreateComponent', () => {
  let component: BlacklistCreateComponent;
  let fixture: ComponentFixture<BlacklistCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlacklistCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
