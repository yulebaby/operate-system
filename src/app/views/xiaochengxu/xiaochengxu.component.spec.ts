import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XiaochengxuComponent } from './xiaochengxu.component';

describe('XiaochengxuComponent', () => {
  let component: XiaochengxuComponent;
  let fixture: ComponentFixture<XiaochengxuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XiaochengxuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XiaochengxuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
