import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesListComponent } from './services-list/services-list.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    ServicesListComponent,
    ServiceDetailComponent,
    HeaderComponent
  ]
})
export class ServicesModule { }
