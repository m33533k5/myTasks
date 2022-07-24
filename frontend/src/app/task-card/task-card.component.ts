import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from "../task";
import {TaskService} from "../task.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  @Input()
  task: Task;
  date = new Date();
  @Output()
  onDelete: EventEmitter<Task> = new EventEmitter<Task>();

  constructor(
    private taskService: TaskService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  goBack(): void {
    this.router.navigate(['tasks']);
  }

  save(): void {
    if (this.task?.allDay){
      this.task.beginDate = this.date
      this.task.endDate = this.date
    }
    if (this.task) {
      this.taskService.updateTask(this.task)
        .subscribe({
          next: () => this.goBack(),
          error: err => {
          }
        });
    }
  }

  delete(task: Task): void {
    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.onDelete.emit(task);
      }
    })
  };
}
