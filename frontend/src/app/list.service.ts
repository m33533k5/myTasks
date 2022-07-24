import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "./message.service";
import {tap} from "rxjs/operators";
import {List} from "./list";

@Injectable({
  providedIn: 'root'
})

export class ListService {

  private listsUrl: string = "http://localhost:8080/lists"

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService,
  ) {
  }

  /** Log a ListService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ListService: ${message}`);
  }

  /** Get All Lists from the Server*/
  findAll(): Observable<List[]> {
    return this.httpClient.get<List[]>(this.listsUrl)
      .pipe(
        tap(_ => this.log('fetched lists'))
      );
  }

   /** Get Lists by id. Will 404 if id not found */
  getList(id: string): Observable<List> {
    const url = `${this.listsUrl}/${id}`;
    return this.httpClient.get<List>(url)
      .pipe(
        tap(_ => this.log(`fetched list id=${id}`))
      );
  }

  /** Put: update the list on the server */
  updateList(list: List): Observable<any> {
    return this.httpClient.put(`${this.listsUrl}/${list.id}`, list).pipe(
      tap(_ => this.log(`updated list id=${list.id}`))
    );
  }

  /** POST: add list to the server */
  addList(list: List): Observable<List> {
    return this.httpClient.post<List>(this.listsUrl, list).pipe(
      tap((newList: List) => this.log(`added list w/ id=${newList.id}`))
    );
  }

  neueMethode(): Observable<Object>{
    return this.httpClient.get(this.listsUrl)
  }

  /** DELETE: delete list from the server */
  deleteList(id: string) {
    const url = `${this.listsUrl}/${id}`;

    return this.httpClient.delete(url).pipe(
      tap(_ => this.log(`deleted list id=${id}`))
    );
  }

  /** GET Lists whose name contains search term */
  searchLists(term: string): Observable<List[]> {
    if (!term.trim()) {
      // if not search term, return empty task array.
      return of([]);
    }
    return this.httpClient.get<List[]>(`${this.listsUrl}/search/findByName?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found lists matching "${term}"`) :
        this.log(`no lists matching "${term}"`))
    );
  }

}
