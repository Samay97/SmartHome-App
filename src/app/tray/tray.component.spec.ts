import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { TrayComponent } from './tray.component';

describe('TrayComponent', () => {
  let component: TrayComponent;
  let fixture: ComponentFixture<TrayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TrayComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in a h1 tag', waitForAsync(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'PAGES.HOME.TITLE'
    );
  }));
});
