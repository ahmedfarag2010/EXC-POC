import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesListComponent } from './services-list/services-list.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesListComponent
  },
  {
    path: ':serviceId',
    component: ServiceDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
