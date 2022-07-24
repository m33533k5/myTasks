import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskSearchComponent} from './task-search.component';
import {TaskService} from "../task.service";
import {By} from "@angular/platform-browser";
import {Task} from "../task";
import {Observable, of, throwError} from "rxjs";
import {FormsModule} from "@angular/forms";

describe('TaskSearchComponent', () => {
  let component: TaskSearchComponent;
  let fixture: ComponentFixture<TaskSearchComponent>;
  let fakeTaskService: { searchTasks(term: string): Observable<Task[]> };
  let service: TaskService;
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
    fakeTaskService = {
      searchTasks(): Observable<Task[]> {
        return of([expectedTask]);
      },
    }

    TestBed.configureTestingModule({
      declarations: [TaskSearchComponent],
      imports: [FormsModule],
      providers: [{provide: TaskService, useValue: fakeTaskService}],
    })
      .compileComponents();
    service = TestBed.inject(TaskService);
    fixture = TestBed.createComponent(TaskSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search for task if button clicked', () => {
    spyOn(fakeTaskService, 'searchTasks').and.callThrough();
    const searchButton = fixture.debugElement.query(By.css('[data-testid="searchButton"]'));
    expect(component.tasks).toEqual([]);
    searchButton.triggerEventHandler('click', null);
    expect(fakeTaskService.searchTasks).toHaveBeenCalledWith("");
    expect(component.tasks).toEqual([expectedTask]);
  });

  it('should create list element', () => {
    const searchButton = fixture.debugElement.query(By.css('[data-testid="searchButton"]'));
    searchButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    const listElement = fixture.debugElement.query(By.css(`[data-testid="listElement_${expectedTask.id}"]`));
    expect(listElement.nativeElement.innerHTML).toEqual(expectedTask.title);
  });

  it('should find task', () => {
    spyOn(fakeTaskService, 'searchTasks').and.callThrough();
    const inputField = fixture.debugElement.query(By.css('[data-testid="searchBox"]')).nativeElement;
    const searchButton = fixture.debugElement.query(By.css('[data-testid="searchButton"]'));
    inputField.value = "test";
    inputField.dispatchEvent(new Event('input'));
    searchButton.triggerEventHandler('click', null);
    expect(fakeTaskService.searchTasks).toHaveBeenCalledWith("test");
    fixture.detectChanges();
    const listElement = fixture.debugElement.query(By.css(`[data-testid="listElement_${expectedTask.id}"]`));
    expect(listElement.nativeElement.innerHTML).toEqual(expectedTask.title);
  });

  it('should not find task because error', () => {
    // given
    spyOn(fakeTaskService, 'searchTasks').and.returnValue(throwError(() => {
      new Error("Fehler")
    }));
    const value = "test";

    // when
    const inputField = fixture.debugElement.query(By.css('[data-testid="searchBox"]')).nativeElement;
    inputField.value = value;
    inputField.dispatchEvent(new Event('input'));
    const searchButton = fixture.debugElement.query(By.css('[data-testid="searchButton"]'));
    searchButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    // then
    expect(fakeTaskService.searchTasks).toHaveBeenCalledWith(value);
    const listElement = fixture.debugElement.query(By.css(`[data-testid="listElement_${expectedTask.id}"]`));
    expect(listElement).toBeFalsy();
  });

});
