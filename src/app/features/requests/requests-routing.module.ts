import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { RequestDetailComponent } from './request-detail/request-detail.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';

const routes: Routes = [
  {
    path: '',
    component: MyRequestsComponent
  },
  {
    path: ':requestId',
    component: RequestDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsRoutingModule { }
