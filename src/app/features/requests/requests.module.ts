import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestsRoutingModule } from './requests-routing.module';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { RequestDetailComponent } from './request-detail/request-detail.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RequestsRoutingModule,
    MyRequestsComponent,
    RequestDetailComponent,
    MyTasksComponent,
    TaskDetailComponent,
    HeaderComponent
  ]
})
export class RequestsModule { }
