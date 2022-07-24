import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {MessageService} from "./message.service";
import {HTTP_INTERCEPTORS, HttpInterceptor} from "@angular/common/http";
import {TestBed} from "@angular/core/testing";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ErrorInterceptor} from "./error-interceptor";
import {ListService} from "./list.service";
import {List} from "./list";

const errorStatus = 500
const errorStatusText = 'Internal server error'
const errorProgressEvent = new ProgressEvent('API error')
const urlLists = 'http://localhost:8080/lists'
let expectedList: List = {
  id: '42fe1cb4-a634-4caf-804e-b2f88e829711',
  name: 'sport'
};
let findAllList: List[] = [{
  id: '42fe1cb4-a634-4caf-804e-b2f88e829712',
  name: 'working'
}];

describe('ListService', () => {
  let service: ListService;
  let httpTestingController: HttpTestingController;
  let messsageService: MessageService;
  let errorInterceptor: HttpInterceptor | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
      providers: [
        MessageService,
        ErrorInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useExisting: ErrorInterceptor,
          multi: true
        },
      ]
    });
    service = TestBed.inject(ListService);
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

  it('getList should return list', (done: DoneFn) => {
    service.getList(expectedList.id).subscribe({
      next: value => expect(value).toBe(expectedList),
      error: _ => fail("Error function must not be called"),
      complete: () => done(),
    });
    httpTestingController
      .expectOne({method: 'GET', url: `${urlLists}/${expectedList.id}`})
      .flush(expectedList)
  });

  it('getList should return error message', () => {
    spyOn(errorInterceptor, 'intercept').and.callThrough();
    service.getList('idDoesntMatter').subscribe({
      next: _ => fail("Next function must not be called"),
      error: _ => {
        expect(errorInterceptor.intercept).toHaveBeenCalled();
      },
      complete: () => fail("Complete function must not be called")
    });
    httpTestingController
      .expectOne({method: 'GET', url: `${urlLists}/idDoesntMatter`})
      .error(errorProgressEvent, {status: errorStatus, statusText: errorStatusText})
  });

  it('addList should add task', (done: DoneFn) => {
    service.addList(expectedList).subscribe(value => {
      expect(value).toBe(expectedList);
      done();
    });
    httpTestingController
      .expectOne({method: 'POST', url: `${urlLists}`})
      .flush(expectedList)
  });

  it('addList should return error message', () => {
    spyOn(errorInterceptor, 'intercept').and.callThrough();
    service.addList(expectedList).subscribe({
      next: _ => fail("Next function must not be called"),
      error: _ => {
        expect(errorInterceptor.intercept).toHaveBeenCalled();
      },
      complete: () => fail("Complete function must not be called")
    });
    httpTestingController
      .expectOne({method: 'POST', url: `${urlLists}`})
      .error(errorProgressEvent, {status: errorStatus, statusText: errorStatusText})
  });

  it('updateList should update task', (done: DoneFn) => {
    service.updateList(expectedList).subscribe(value => {
      expect(value).toBe(expectedList);
      done();
    });
    httpTestingController
      .expectOne({method: 'PUT', url: `${urlLists}/${expectedList.id}`})
      .flush(expectedList)
  });

  it('updateList should return error message', () => {
    spyOn(errorInterceptor, 'intercept').and.callThrough();
    service.updateList(expectedList).subscribe({
      next: _ => fail("Next function must not be called"),
      error: _ => {
        expect(errorInterceptor.intercept).toHaveBeenCalled();
      },
      complete: () => fail("Complete function must not be called")
    });
    httpTestingController
      .expectOne({method: 'PUT', url: `${urlLists}/${expectedList.id}`})
      .error(errorProgressEvent, {status: errorStatus, statusText: errorStatusText})
  });

  it('deleteList should delete task', (done: DoneFn) => {
    service.deleteList(expectedList.id).subscribe(value => {
      expect(value).toBe(expectedList);
      done();
    });
    httpTestingController
      .expectOne({method: 'DELETE', url: `${urlLists}/${expectedList.id}`})
      .flush(expectedList)
  });

  it('deleteList should return error message', () => {
    spyOn(errorInterceptor, 'intercept').and.callThrough();
    service.deleteList(expectedList.id).subscribe({
      next: _ => fail("Next function must not be called"),
      error: _ => {
        expect(errorInterceptor.intercept).toHaveBeenCalled();
      },
      complete: () => fail("Complete function must not be called")
    });
    httpTestingController
      .expectOne({method: 'DELETE', url: `${urlLists}/${expectedList.id}`})
      .error(errorProgressEvent, {status: errorStatus, statusText: errorStatusText})
  });

  it('findAll should find all lists', (done: DoneFn) => {
    service.findAll().subscribe(value => {
      expect(value).toEqual(findAllList);
      done();
    });
    httpTestingController
      .expectOne({method: 'GET', url: `${urlLists}`})
      .flush(findAllList)
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
      .expectOne({method: 'GET', url: `${urlLists}`})
      .error(errorProgressEvent, {status: errorStatus, statusText: errorStatusText})
  });

});
