import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskSearchAsyncComponent} from './task-search-async.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TaskService} from "../task.service";
import {Observable, of} from "rxjs";
import {Task} from "../task";
import {By} from "@angular/platform-browser";
import {NO_ERRORS_SCHEMA} from "@angular/core";

function setTimeoutPromise(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

describe('TaskSearchAsyncComponent', () => {
  let component: TaskSearchAsyncComponent;
  let fixture: ComponentFixture<TaskSearchAsyncComponent>;
  let fakeTaskService: { searchTasks(term: string): Observable<Task[]> };
  let expectedTask: Task = {
    id: '42fe1cb4-a634-4caf-804e-b2f88e829711',
    title: 'testtitle',
    done: false,
    allDay: false,
    beginDate: new Date(),
    endDate: new Date(),
    listId: '42fe1cb4-a634-4caf-804e-b2f88e829710'
  };
  let li: HTMLElement;
  let ul: HTMLElement;

  beforeEach(() => {
    fakeTaskService = {
      searchTasks(): Observable<Task[]> {
        return of([expectedTask]);
      },
    }

    spyOn(fakeTaskService, 'searchTasks').and.callThrough();

    TestBed.configureTestingModule({
      declarations: [TaskSearchAsyncComponent],
      imports: [HttpClientTestingModule],
      providers: [{provide: TaskService, useValue: fakeTaskService}],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
    fixture = TestBed.createComponent(TaskSearchAsyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    li = fixture.nativeElement.querySelector('li')
    ul = fixture.nativeElement.querySelector('ul')
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create list element', async () => {
    //given
    const {debugElement} = fixture;
    const inputField = debugElement.query(By.css('[data-testid="searchBox"]')).nativeElement;

    //when
    inputField.value = "te";
    inputField.dispatchEvent(new Event('input'));
    await setTimeoutPromise(1000);
    fixture.detectChanges();

    //then
    const listElement = debugElement.query(By.css(`[data-testid="listElement_${expectedTask.id}"]`));
    expect(listElement).toBeTruthy();
  });

  it('should find term', (done: DoneFn) => {
    //given
    spyOn(component, 'search').and.callThrough();

    //when
    fixture.detectChanges();
    const {debugElement} = fixture;
    const inputField = debugElement.query(By.css('[data-testid="searchBox"]'));
    inputField.nativeElement.value = "test";
    component.search(inputField.nativeElement.value);

    //then
    expect(component.search).toHaveBeenCalled();
    expect(inputField.nativeElement.value).toEqual("test");
    expect(component.search).toHaveBeenCalledWith("test");
    done();
  });

});
