import {Component, OnInit} from '@angular/core';
import {Task} from "../task";
import {TaskService} from "../task.service";
import {List} from "../list";
import {ListService} from "../list.service";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})

export class TasksComponent implements OnInit {
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

  delete(task: Task): void {
    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(h => h !== task);
      }
    })
  };
}
