import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {TaskDetailComponent} from "./task-detail/task-detail.component";
import {ListsComponent} from "./lists/lists.component";
import {TaskGridComponent} from "./task-grid/task-grid.component";

export const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'tasks', component: TaskGridComponent},
  {path: 'lists', component: ListsComponent},
  {path: 'detail/:id', component: TaskDetailComponent},
  {path: '**', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
