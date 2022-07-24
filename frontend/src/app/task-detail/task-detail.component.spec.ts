import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TaskDetailComponent} from './task-detail.component';
import {TaskService} from "../task.service";
import {Observable, of, throwError} from "rxjs";
import {Task} from "../task";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivatedRoute, Event, Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {BrowserModule, By} from "@angular/platform-browser";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('TaskDetailComponent', () => {
  let expectedTask: Task = {
    id: '42fe1cb4-a634-4caf-804e-b2f88e829711',
    title: 'testtitle',
    done: false,
    allDay: false,
    beginDate: new Date("2019-01-16"),
    endDate: new Date("2019-01-16"),
    listId: '42fe1cb4-a634-4caf-804e-b2f88e829710'
  };
  let route: { snapshot: { paramMap: any; }; };
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;
  let fakeTaskService: {
    getTask(id: string): Observable<any>;
    updateTask(task: Task): Observable<Task>
  };
  let service: TaskService;
  let router: Router;
  let h2: HTMLElement;

  fakeTaskService = {
    updateTask(task: Task): Observable<Task> {
      return of({title: task.title, id: "123", done: task.done, allDay: task.allDay, beginDate: task.beginDate, endDate: task.endDate, listId: task.listId} as Task);
    },
    getTask(): Observable<any> {
      return of({...expectedTask});
    },
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskDetailComponent],
      imports: [RouterTestingModule, FormsModule, MatCheckboxModule, BrowserModule, BrowserAnimationsModule, HttpClientTestingModule],
      providers: [
        {provide: TaskService, useValue: fakeTaskService},
        RouterTestingModule,
      ],
    })
      .compileComponents();
    service = TestBed.inject(TaskService);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    route = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read routing', () => {
    //given
    spyOn(fakeTaskService, 'getTask').and.callThrough();
    spyOn(route.snapshot.paramMap, 'get').and.returnValue('21');

    //when
    fixture.detectChanges();

    //then
    expect(fakeTaskService.getTask).toHaveBeenCalledWith('21');
    expect(component.task).toEqual(expectedTask);
  });

  it('should contain task title', () => {
    fixture.detectChanges();
    h2 = fixture.nativeElement.querySelector('h2');
    expect(h2.textContent).toEqual("TESTTITLE Details");
  });

  it('should contain task id', () => {
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('[data-testid="spanTest"]')).nativeElement;
    expect(span.textContent).toEqual(" id: " + expectedTask.id);
  });

  it('should contain task title in input field', (done: DoneFn) => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('[data-testid="inputTest"]')).nativeElement;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(input.value).toBe("testtitle");
      done();
    });
  });

  it('should change task title if changes got saved', (done: DoneFn) => {
    //given
    spyOn(component, 'save').and.callThrough();
    spyOn(fakeTaskService, 'updateTask').and.callThrough();
    spyOn(router, 'navigate');

    //when
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('[data-testid="inputTest"]')).nativeElement;
    const save = fixture.debugElement.query(By.css('[data-testid="save"]'));

    //then
    fixture.whenStable().then(() => {
      input.value = "neu";
      input.dispatchEvent(new Event('input'));
      expect(fixture.componentInstance.task?.title).toBe("neu");
      save.triggerEventHandler('click', null);
      expect(component.save).toHaveBeenCalled();
      expect(fakeTaskService.updateTask).toHaveBeenCalledWith({
        id: '42fe1cb4-a634-4caf-804e-b2f88e829711',
        title: 'neu',
        done: false,
        allDay: false,
        beginDate: expectedTask.beginDate,
        endDate: expectedTask.endDate,
        listId: '42fe1cb4-a634-4caf-804e-b2f88e829710'
      });
      expect(router.navigate).toHaveBeenCalledWith(['tasks']);
      done();
    });
  });

  it('should go back if button clicked', () => {
    //given
    spyOn(component, 'goBack').and.callThrough();
    spyOn(router, 'navigate');

    //when
    fixture.detectChanges();
    const goBack = fixture.debugElement.query(By.css('[data-testid="goBack"]'));
    goBack.triggerEventHandler('click', null);

    //then
    expect(component.goBack).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['tasks']);
  });

  it('should do error if saved', () => {
    //given
    spyOn(fakeTaskService, 'updateTask').and.returnValue(throwError(() => {
      new Error("Fehler")
    }));

    //when
    fixture.detectChanges();
    const save = fixture.debugElement.query(By.css('[data-testid="save"]'));
    save.triggerEventHandler('click', null);

    //then
    expect(fakeTaskService.updateTask).toHaveBeenCalled();
  });

  it('getTask throw error', () => {
    //given
    spyOn(fakeTaskService, 'getTask').and.returnValue(throwError(() => {
      new Error("Fehler")
    }));

    //when
    fixture.detectChanges();

    //then
    expect(fakeTaskService.getTask).toHaveBeenCalled();
    expect(component.task).toBeUndefined();
  });

  it('should click change value',() => {
    //given
    spyOn(fakeTaskService, 'updateTask').and.callThrough();

    //when
    fixture.detectChanges();
    const checkboxAllDay = fixture.debugElement.queryAll(By.css('mat-checkbox input'));
    expect(checkboxAllDay).toBeTruthy();
    expect(checkboxAllDay[0].nativeElement.checked).toBeFalse();
    expect(checkboxAllDay[1].nativeElement.checked).toBeFalse();
    checkboxAllDay[0].nativeElement.dispatchEvent(new Event('click'));
    checkboxAllDay[1].nativeElement.dispatchEvent(new Event('click'));
    expect(checkboxAllDay[0].nativeElement.checked).toBeTrue();
    expect(checkboxAllDay[1].nativeElement.checked).toBeTrue();

    //then
    const save = fixture.debugElement.query(By.css('[data-testid="save"]'));
    save.triggerEventHandler('click', null);
    expect(fakeTaskService.updateTask).toHaveBeenCalledWith({
      id: '42fe1cb4-a634-4caf-804e-b2f88e829711',
      title: 'testtitle',
      done: true,
      allDay: true,
      beginDate: component.date,
      endDate: component.date,
      listId: '42fe1cb4-a634-4caf-804e-b2f88e829710'
    });
  });
});
