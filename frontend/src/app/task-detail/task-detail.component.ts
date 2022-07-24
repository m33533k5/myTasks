import {Component, OnInit} from '@angular/core';
import {Task} from '../task';
import {TaskService} from "../task.service";
import {ActivatedRoute} from "@angular/router";
import {Router} from '@angular/router';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})

export class TaskDetailComponent implements OnInit {
  task: Task | undefined;
  date = new Date();

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.getTask();
  }

  goBack(): void {
    this.router.navigate(['tasks']);
  }

  getTask(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.taskService.getTask(id)
      .subscribe({
        next: task => this.task = task
      });
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
}
