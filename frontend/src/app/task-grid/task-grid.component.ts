import { Component, OnInit } from '@angular/core';
import {Task} from "../task";
import {List} from "../list";
import {TaskService} from "../task.service";
import {ListService} from "../list.service";

@Component({
  selector: 'app-task-grid',
  templateUrl: './task-grid.component.html',
  styleUrls: ['./task-grid.component.scss']
})
export class TaskGridComponent implements OnInit {
  tasks: Task[] = [];
  lists: List[] = [];
  selectedListValue: List = {} as List;

  constructor(
    private taskService: TaskService,
    private listService: ListService
  ) {
  }

  ngOnInit(): void {
    this.getTasks();
    this.getLists();
  }

  getTasks(): void {
    this.taskService.findAll()
      .subscribe(tasks => this.tasks = tasks);
  }

  getLists(): void {
    this.listService.findAll()
      .subscribe(lists => this.lists = lists);
  }

  add(title: string): void {
    title = title.trim();
    if (!title) {
      return;
    }
    this.taskService.addTask({title, listId: this.selectedListValue.id} as Task)
      .subscribe(task => {
        this.tasks.push(task);
      });
  }

  delete(task: Task): void{
    this.tasks = this.tasks.filter(value => value != task);
  }

}
