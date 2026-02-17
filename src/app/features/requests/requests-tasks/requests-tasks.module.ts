import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestsTasksRoutingModule } from './requests-tasks-routing.module';
import { MyTasksComponent } from '../my-tasks/my-tasks.component';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { HeaderComponent } from '../../../shared/layout/header/header.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RequestsTasksRoutingModule,
    MyTasksComponent,
    TaskDetailComponent,
    HeaderComponent
  ]
})
export class RequestsTasksModule { }
