import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TasksComponent} from './tasks.component';
import {TaskService} from "../task.service";
import {By} from "@angular/platform-browser";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {Task} from "../task";
import {FormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSelectModule} from "@angular/material/select";

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let fakeTaskService: {
    deleteTask(id: string): Observable<any>;
    findAll(): Observable<Task[]>;
    addTask(task: Task): Observable<Task>
  };
  let expectedTask: Task = {
    id: '42fe1cb4-a634-4caf-804e-b2f88e829711',
    title: 'testtitle',
    done: false,
    allDay: false,
    beginDate: new Date(),
    endDate: new Date(),
    listId: '42fe1cb4-a634-4caf-804e-b2f88e829710'
  };
  let fakeTask$: BehaviorSubject<Task>;

  beforeEach(async () => {
    fakeTask$ = new BehaviorSubject(expectedTask);

    fakeTaskService = {
      addTask(task: Task): Observable<Task> {
        return of({title: task.title, id: "123", listId: task.listId} as Task);
      },
      deleteTask(): Observable<any> {
        return of(undefined)
      },
      findAll(): Observable<Task[]> {
        return of([expectedTask]);
      }
    }

    await TestBed.configureTestingModule({
      declarations: [TasksComponent],
      imports: [FormsModule, RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule, MatSelectModule],
      providers: [{provide: TaskService, useValue: fakeTaskService}],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create child component', () => {
    const taskComponent = fixture.debugElement.query(By.css('app-task'));
    expect(taskComponent).toBeTruthy();
  });

  it('should passes task', () => {
    const taskComponent = fixture.debugElement.query(By.css('app-task'));
    expect(taskComponent.properties['task']).toBe(expectedTask);
  });

  it('should add task with button', () => {
    //given
    spyOn(fakeTaskService, 'addTask').and.callThrough();
    const inputField = fixture.debugElement.query(By.css('#new-task'));
    const selectValue = fixture.debugElement.query(By.css('[data-testid="selectValue"]'))

    //when
    inputField.nativeElement.value = "Test";
    selectValue.nativeElement.value = "42fe1cb4-a634-4caf-804e-b2f88e829710";
    const addButton = fixture.debugElement.query(By.css('[data-testid="addButton"]'));
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    //the
    expect(fakeTaskService.addTask).toHaveBeenCalledWith({title: "Test", listId: undefined} as unknown as Task);
    expect(component.tasks).toEqual([expectedTask, {title: "Test", id: "123", listId: undefined} as unknown as Task]);
    const deleteButton1 = fixture.debugElement.query(By.css(`[data-testid="deleteButton_${expectedTask.id}"]`));
    const deleteButton2 = fixture.debugElement.query(By.css(`[data-testid="deleteButton_123"]`));
    expect(deleteButton1).toBeTruthy();
    expect(deleteButton2).toBeTruthy();
  });

  it('should not delete if error', () => {
    //given
    spyOn(fakeTaskService, 'deleteTask').and.returnValue(throwError(() => {
      new Error("Fehler")
    }));

    //when
    const deleteButton = fixture.debugElement.query(By.css(`[data-testid="deleteButton_${expectedTask.id}"]`));
    deleteButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    //then
    const deleteButton2 = fixture.debugElement.query(By.css(`[data-testid="deleteButton_${expectedTask.id}"]`))
    expect(fakeTaskService.deleteTask).toHaveBeenCalled();
    expect(deleteButton2).toBeTruthy();
  });

  it('should delete task with button', () => {
    //given
    spyOn(fakeTaskService, 'deleteTask').and.callThrough();

    //when
    const deleteButton = fixture.debugElement.query(By.css(`[data-testid="deleteButton_${expectedTask.id}"]`));
    deleteButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    //then
    expect(fakeTaskService.deleteTask).toHaveBeenCalled();
    expect(component.tasks.length).toEqual(0);
    const deleteButtonNotExist = fixture.debugElement.query(By.css(`[data-testid="deleteButton_${expectedTask.id}"]`));
    expect(deleteButtonNotExist).toBeNull();
  });

  it('should not add task if title null', () => {
    //given
    spyOn(fakeTaskService, 'addTask').and.callThrough();

    //when
    const inputField = fixture.debugElement.query(By.css('#new-task'));
    inputField.nativeElement.value = "";
    const addButton = fixture.debugElement.query(By.css('[data-testid="addButton"]'));
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    //then
    expect(component.tasks).toEqual([expectedTask]);
  });
});
