import {Component, Input, OnInit} from '@angular/core';
import {List} from "../list";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input()
  list: List = {id: '', name: ''};

  constructor() { }

  ngOnInit(): void {
  }

}
