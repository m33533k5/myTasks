import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TaskComponent} from './task.component';
import {Task} from "../task";
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";
import {Location} from "@angular/common";

import {routes} from "../app-routing.module";
import {By} from "@angular/platform-browser";


describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let span: HTMLElement;
  let a: HTMLElement;
  let router: Router;
  let location: Location;
  let expectedTask: Task = {
    id: '42fe1cb4-a634-4caf-804e-b2f88e829711',
    title: 'testtitle',
    done: false,
    allDay: false,
    beginDate: new Date(),
    endDate: new Date(),
    listId: '42fe1cb4-a634-4caf-804e-b2f88e829710'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskComponent],
      imports: [RouterTestingModule.withRoutes(routes)]
    })
      .compileComponents();
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    component.task = expectedTask;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain task information', () => {
    span = fixture.nativeElement.querySelector('span');
    a = fixture.nativeElement.querySelector('a');
    expect(span.textContent).toContain(expectedTask.id);
    expect(a.textContent).toContain("42fe1cb4-a634-4caf-804e-b2f88e829711 testtitle");
  });

  it('should navigate to dashboard', fakeAsync(() => {
    fixture.debugElement.query(By.css('a')).nativeElement.click();
    tick();
    expect(router.url).toBe(`/detail/${expectedTask.id}`);
  }));
});
