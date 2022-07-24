import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponent } from './list.component';
import {List} from "../list";

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let a: HTMLElement;
  let expectedList: List = {
    id: '42fe1cb4-a634-4caf-804e-b2f88e829711',
    name: 'sport'
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    component.list = expectedList;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain list information', () =>{
    a = fixture.nativeElement.querySelector('a');
    expect(a.textContent).toContain(expectedList.name);
  });
});
