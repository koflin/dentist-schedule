import { Component, OnInit } from '@angular/core';

import { AppointmentsService } from '../services/appointments.service';

@Component({
  selector: 'app-appointments-reset',
  templateUrl: './appointments-reset.component.html',
  styleUrls: ['./appointments-reset.component.css']
})
export class AppointmentsResetComponent implements OnInit {

  constructor(
    private appointmentsService: AppointmentsService
  ) { }

  ngOnInit(): void {
  }

  reset() {
    this.appointmentsService.reset().subscribe();
  }
}
