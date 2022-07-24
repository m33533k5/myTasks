import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Task} from "./task";
import {MessageService} from "./message.service";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  private tasksUrl: string = "http://localhost:8080/tasks"

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService,
  ) {
  }

  /** Log a TaskService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`TaskService: ${message}`);
  }

  /** Get All Tasks from the Server*/
  findAll(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.tasksUrl)
      .pipe(
        tap(_ => this.log('fetched tasks2'))
      );
  }

   /** Get Tasks by id. Will 404 if id not found */
  getTask(id: string): Observable<Task> {
    const url = `${this.tasksUrl}/${id}`;
    return this.httpClient.get<Task>(url)
      .pipe(
        tap(_ => this.log(`fetched task id=${id}`))
      );
  }

  /** Put: update the task on the server */
  updateTask(task: Task): Observable<any> {
    return this.httpClient.put(`${this.tasksUrl}/${task.id}`, task).pipe(
      tap(_ => this.log(`updated task id=${task.id}`))
    );
  }

  /** POST: add task to the server */
  addTask(task: Task): Observable<Task> {
    return this.httpClient.post<Task>(this.tasksUrl, task).pipe(
      tap((newTask: Task) => this.log(`added task w/ id=${newTask.id}`))
    );
  }

  /** DELETE: delete task from the server */
  deleteTask(id: string) {
    const url = `${this.tasksUrl}/${id}`;

    return this.httpClient.delete(url).pipe(
      tap(_ => this.log(`deleted task id=${id}`))
    );
  }

  /** GET Tasks whose name contains search term */
  searchTasks(term: string): Observable<Task[]> {
    if (!term.trim()) {
      // if not search term, return empty task array.
      return of([]);
    }
    return this.httpClient.get<Task[]>(`${this.tasksUrl}/search/findByTitle?title=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found tasks matching "${term}"`) :
        this.log(`no tasks matching "${term}"`))
    );
  }

}
