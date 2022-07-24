import {Component, Input, OnInit} from '@angular/core';
import {Task} from "../task";


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})

export class TaskComponent implements OnInit {
  @Input()
  task: Task = {id: '', title: '', beginDate: new Date, endDate: new Date, allDay: false, done: false, listId: ''};

  constructor() {
  }

  ngOnInit(): void {
  }

}
