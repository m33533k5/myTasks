import {Component, OnInit} from '@angular/core';
import {List} from "../list";
import {ListService} from "../list.service";

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  lists: List[] = [];

  constructor(
    private listService: ListService,
  ) {
  }

  ngOnInit(): void {
    this.getLists();
  }

  getLists(): void {
    this.listService.findAll()
      .subscribe(lists => this.lists = lists);
  }

  add(listName: string): void {
    listName = listName.trim();
    if (!listName) {
      return
    }
    this.listService.addList({name: listName} as List)
      .subscribe({
        next: list => {
          if (list) {
            this.lists.push(list);
          }
        },
      })
  }

  delete(list: List): void {
    this.listService.deleteList(list.id)
      .subscribe({
        next: response => {
            this.lists = this.lists.filter(h => h !== list);
        }
      })
  }

}
