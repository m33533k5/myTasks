import {TestBed} from '@angular/core/testing';

import {TaskService} from './task.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Task} from "./task";
import {MessageService} from "./message.service";
import {HTTP_INTERCEPTORS, HttpInterceptor} from "@angular/common/http";
import {ErrorInterceptor} from "./error-interceptor";
import {MatSnackBarModule} from "@angular/material/snack-bar";

const errorStatus = 500
const errorStatusText = 'Internal server error'
const errorProgressEvent = new ProgressEvent('API error')
const urlTasks = 'http://localhost:8080/tasks'
let expectedTask: Task = {
  id: '42fe1cb4-a634-4caf-804e-b2f88e829711',
  title: 'testtitle',
  done: false,
  allDay: false,
  beginDate: new Date(),
  endDate: new Date(),
  listId: '42fe1cb4-a634-4caf-804e-b2f88e829710'
};
let findAllTasks: Task[] = [{
  id: '42fe1cb4-a634-4caf-804e-b2f88e829711',
  title: 'testtitle',
  done: false,
  allDay: false,
  beginDate: new Date(),
  endDate: new Date(),
  listId: '42fe1cb4-a634-4caf-804e-b2f88e829710'
}];

describe('TaskService', () => {
  let service: TaskService;
  let httpTestingController: HttpTestingController;
  let messsageService: MessageService;
  let errorInterceptor: HttpInterceptor | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
      providers: [
        TaskService,
        MessageService,
        ErrorInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useExisting: ErrorInterceptor,
          multi: true
        },
      ]
    });
    service = TestBed.inject(TaskService);
    messsageService = TestBed.inject(MessageService);
    httpTestingController = TestBed.inject(HttpTestingController);
    errorInterceptor = TestBed.inject(ErrorInterceptor);
  });

  //Sicherheitsmechanismus um zu überprüfen, ob auch alle anfragen verarbeitet wurden
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTask should return task', (done: DoneFn) => {
    service.getTask(expectedTask.id).subscribe({
      next: value => expect(value).toBe(expectedTask),
      error: _ => fail("Error function must not be called"),
      complete: () => done(),
    });
    httpTestingController
      .expectOne({method: 'GET', url: `${urlTasks}/${expectedTask.id}`})
      .flush(expectedTask)
  });

  it('getTask should return error message', () => {
    spyOn(errorInterceptor, 'intercept').and.callThrough();
    service.getTask('idDoesntMatter').subscribe({
      next: _ => fail("Next function must not be called"),
      error: _ => {
        expect(errorInterceptor.intercept).toHaveBeenCalled();
      },
      complete: () => fail("Complete function must not be called")
    });
    httpTestingController
      .expectOne({method: 'GET', url: `${urlTasks}/idDoesntMatter`})
      .error(errorProgressEvent, {status: errorStatus, statusText: errorStatusText})
  });

   it('addTask should add task', (done: DoneFn) => {
    service.addTask(expectedTask).subscribe(value => {
      expect(value).toBe(expectedTask);
      done();
    });
    httpTestingController
      .expectOne({method: 'POST', url: `${urlTasks}`})
      .flush(expectedTask)
  });

   it('addTask should return error message', () => {
     spyOn(errorInterceptor, 'intercept').and.callThrough();
     service.addTask(expectedTask).subscribe({
      next: _ => fail("Next function must not be called"),
      error: _ => {
        expect(errorInterceptor.intercept).toHaveBeenCalled();
      },
      complete: () => fail("Complete function must not be called")
    });
    httpTestingController
      .expectOne({method: 'POST', url: `${urlTasks}`})
      .error(errorProgressEvent, {status: errorStatus, statusText: errorStatusText})
  });

   it('updateTask should update task', (done: DoneFn) => {
    service.updateTask(expectedTask).subscribe(value => {
      expect(value).toBe(expectedTask);
      done();
    });
    httpTestingController
      .expectOne({method: 'PUT', url: `${urlTasks}/${expectedTask.id}`})
      .flush(expectedTask)
  });

   it('updateTask should return error message', () => {
     spyOn(errorInterceptor, 'intercept').and.callThrough();
     service.updateTask(expectedTask).subscribe({
      next: _ => fail("Next function must not be called"),
      error: _ => {
        expect(errorInterceptor.intercept).toHaveBeenCalled();
      },
      complete: () => fail("Complete function must not be called")
    });
    httpTestingController
      .expectOne({method: 'PUT', url: `${urlTasks}/${expectedTask.id}`})
      .error(errorProgressEvent, {status: errorStatus, statusText: errorStatusText})
  });

   it('deleteTask should delete task', (done: DoneFn) => {
    service.deleteTask(expectedTask.id).subscribe(value => {
      expect(value).toBe(expectedTask);
      done();
    });
    httpTestingController
      .expectOne({method: 'DELETE', url: `${urlTasks}/${expectedTask.id}`})
      .flush(expectedTask)
  });

   it('deleteTask should return error message', () => {
     spyOn(errorInterceptor, 'intercept').and.callThrough();
     service.deleteTask(expectedTask.id).subscribe({
      next: _ => fail("Next function must not be called"),
      error: _ => {
        expect(errorInterceptor.intercept).toHaveBeenCalled();
      },
      complete: () => fail("Complete function must not be called")
    });
    httpTestingController
      .expectOne({method: 'DELETE', url: `${urlTasks}/${expectedTask.id}`})
      .error(errorProgressEvent, {status: errorStatus, statusText: errorStatusText})
  });

   it('findAll should find all tasks', (done: DoneFn) => {
    service.findAll().subscribe(value => {
      expect(value).toEqual(findAllTasks);
      done();
    });
    httpTestingController
      .expectOne({method: 'GET', url: `${urlTasks}`})
      .flush(findAllTasks)
  });

   it('findAll should return error message', () => {
     spyOn(errorInterceptor, 'intercept').and.callThrough();
     service.findAll().subscribe({
      next: _ => fail("Next function must not be called"),
      error: _ => {
        expect(errorInterceptor.intercept).toHaveBeenCalled();
      },
      complete: () => fail("Complete function must not be called")
    });
    httpTestingController
      .expectOne({method: 'GET', url: `${urlTasks}`})
      .error(errorProgressEvent, {status: errorStatus, statusText: errorStatusText})
  });

   it('searchTasks should find a task', (done: DoneFn) => {
    spyOn(messsageService, 'add')
    service.searchTasks("A").subscribe(value => {
      expect(value).toEqual(findAllTasks);
      expect(messsageService.add).toHaveBeenCalledWith('TaskService: found tasks matching "A"' )
      done();
    });
    httpTestingController
      .expectOne({method: 'GET', url: `${urlTasks}/search/findByTitle?title=A`})
      .flush(findAllTasks)
  });

   it('searchTasks should find nothing if searchterm is empty', (done: DoneFn) => {
    service.searchTasks("").subscribe({
      next: value => expect(value).toEqual([]),
      error: _ => fail("Error function must not be called"),
      complete: () => done()
    });
    httpTestingController
      .expectNone({method: 'GET', url: `${urlTasks}/search/findByTitle?title=`})
  });

   it('searchTasks should find nothing if searchterm had no matches', (done: DoneFn) => {
    spyOn(messsageService, 'add')
    service.searchTasks("djf").subscribe({
      next: value => {
        expect(value).toEqual([]);
        expect(messsageService.add).toHaveBeenCalledWith('TaskService: no tasks matching "djf"' )
      },
      error: _ => fail("Error function must not be called"),
      complete: () => done()
    });
    httpTestingController
      .expectOne({method: 'GET', url: `${urlTasks}/search/findByTitle?title=djf`})
      .flush([]);
  });

   it('searchTasks should return error message', () => {
     spyOn(errorInterceptor, 'intercept').and.callThrough();
     service.searchTasks("A").subscribe({
      next: _ => fail("Next function must not be called"),
      error: _ => {
        expect(errorInterceptor.intercept).toHaveBeenCalled();
      },
      complete: () => fail("Complete function must not be called")
    });
    httpTestingController
      .expectOne({method: 'GET', url: `${urlTasks}/search/findByTitle?title=A`})
      .error(errorProgressEvent, {status: errorStatus, statusText: errorStatusText})
  });

});
