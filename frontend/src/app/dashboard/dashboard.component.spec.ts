import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {DashboardComponent} from './dashboard.component';
import {TaskService} from "../task.service";
import {TaskSearchComponent} from "../task-search/task-search.component";
import {FormsModule} from "@angular/forms";
import {Task} from "../task";
import {RouterTestingModule} from "@angular/router/testing";
import {By} from "@angular/platform-browser";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {Observable, of, throwError} from "rxjs";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {routes} from "../app-routing.module";

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let service: TaskService;
  let expectedTask1: Task = {
    id: '42fe1cb4-a634-4caf-804e-b2f88e829711',
    title: 'testtitle1',
    done: false,
    allDay: false,
    beginDate: new Date(),
    endDate: new Date(),
    listId: '42fe1cb4-a634-4caf-804e-b2f88e829710'
  };
  let expectedTask2: Task = {
    id: '42fe1cb4-a634-4caf-804e-b2f88e829712',
    title: 'testtitle2',
    done: false,
    allDay: false,
    beginDate: new Date(),
    endDate: new Date(),
    listId: '42fe1cb4-a634-4caf-804e-b2f88e829710'
  };
  let expectedTask3: Task = {
    id: '42fe1cb4-a634-4caf-804e-b2f88e829713',
    title: 'testtitle3',
    done: false,
    allDay: false,
    beginDate: new Date(),
    endDate: new Date(),
    listId: '42fe1cb4-a634-4caf-804e-b2f88e829710'
  };
  const expectedAllTasks: Task[] = [expectedTask1, expectedTask2, expectedTask3];
  let fakeTaskService: { findAll(): Observable<Task[]>; };
  let router: Router;
  let location: Location;

  fakeTaskService = {
    findAll(): Observable<Task[]> {
      return of(expectedAllTasks);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent, TaskSearchComponent],
      imports: [FormsModule, RouterTestingModule.withRoutes(routes), HttpClientTestingModule],
      providers: [{provide: TaskService, useValue: fakeTaskService}],
    })
      .compileComponents();
    service = TestBed.inject(TaskService);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display task title', () => {
    //given
    spyOn(fakeTaskService, 'findAll').and.callThrough();

    //when
    fixture.detectChanges();
    let a = fixture.debugElement.queryAll(By.css('a'));

    //then
    expect(fakeTaskService.findAll).toHaveBeenCalled();
    expect(a.length).toBe(3);
    expect(a[0].nativeElement.textContent).toEqual(expectedTask1.title);
    expect(a[1].nativeElement.textContent).toEqual(expectedTask2.title);
    expect(a[2].nativeElement.textContent).toEqual(expectedTask3.title);
  });

  it('should create child component', () => {
    const {debugElement} = fixture;
    const taskSearchComponent = debugElement.query(By.css('app-task-search'));
    expect(taskSearchComponent).toBeTruthy();
  });

  it('should navigate correct', fakeAsync(() => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('a')).nativeElement.click();
    tick();
    expect(router.url).toBe(`/detail/${expectedTask1.id}`);
  }));

  it('should throw error', () => {
    //given
    spyOn(fakeTaskService, 'findAll').and.returnValue(throwError(() => {
      new Error("Fehler")
    }));

    //when
    fixture.detectChanges();

    //then
    expect(fakeTaskService.findAll).toHaveBeenCalled();
    expect(component.tasks).toEqual([]);
    let a = fixture.debugElement.queryAll(By.css('a'));
    expect(a.length).toBe(0);
  });
});
