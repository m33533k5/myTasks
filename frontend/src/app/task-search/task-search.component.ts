import {Component, OnInit} from '@angular/core';
import {TaskService} from "../task.service";
import {Task} from "../task";

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss']
})
export class TaskSearchComponent implements OnInit {
  searchTerm: string = "";
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
  }

  search(): void {
    this.taskService.searchTasks(this.searchTerm).subscribe({
      next: value => {
        this.tasks = value
      },
      error: err => {
      }
    });
  }
}
