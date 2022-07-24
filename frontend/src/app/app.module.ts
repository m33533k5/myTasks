import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {TaskDetailComponent} from './task-detail/task-detail.component';
import {TasksComponent} from './tasks/tasks.component';
import {MessagesComponent} from './messages/messages.component';

import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TaskSearchAsyncComponent} from './task-search-async/task-search-async.component';
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";
import {TaskSearchComponent} from './task-search/task-search.component';
import {TaskComponent} from './task/task.component';
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import {
  IgxDatePickerModule,
  IgxDateTimeEditorModule,
  IgxIconModule,
  IgxInputGroupModule,
  IgxTimePickerModule
} from "igniteui-angular";
import {ListsComponent} from './lists/lists.component';
import {ListComponent} from './list/list.component';
import {ErrorInterceptor} from "./error-interceptor";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {LayoutModule} from '@angular/cdk/layout';
import {TaskGridComponent} from './task-grid/task-grid.component';
import {MatCardModule} from "@angular/material/card";
import {TaskCardComponent} from './task-card/task-card.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {FlexModule} from "@angular/flex-layout";
import {MatDatetimepickerModule} from "@mat-datetimepicker/core";

//I keep the new line
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    IgxTimePickerModule,
    IgxInputGroupModule,
    IgxIconModule,
    ReactiveFormsModule,
    IgxDatePickerModule,
    IgxDateTimeEditorModule,
    MatSnackBarModule,
    MatListModule,
    MatSelectModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    LayoutModule,
    MatCardModule,
    MatGridListModule,
    FlexModule,
    MatDatetimepickerModule,
    MatDatepickerModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    TasksComponent,
    TaskDetailComponent,
    MessagesComponent,
    TaskSearchAsyncComponent,
    TaskSearchComponent,
    TaskComponent,
    ListsComponent,
    ListComponent,
    TaskGridComponent,
    TaskCardComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
