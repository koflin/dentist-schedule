import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppointmentComponent } from './appointment/appointment.component';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';
import { AppointmentsResetComponent } from './appointments-reset/appointments-reset.component';

const routes: Routes = [
  { path: 'appointments', component: AppointmentsListComponent },
  { path: 'appointment/:id', component: AppointmentComponent },
  { path: 'appointments/reset', component: AppointmentsResetComponent },
  { path: '**', redirectTo: 'appointments' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
