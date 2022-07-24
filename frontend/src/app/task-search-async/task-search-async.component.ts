import {Component, OnInit} from '@angular/core';

import {Observable, Subject} from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import {Task} from '../task';
import {TaskService} from '../task.service';

@Component({
  selector: 'app-task-search-async',
  templateUrl: './task-search-async.component.html',
  styleUrls: ['./task-search-async.component.scss'],
})

export class TaskSearchAsyncComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  private searchTerms = new Subject<string>();

  constructor(private taskService: TaskService) {
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.tasks$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.taskService.searchTasks(term)),
    );
  }
}
