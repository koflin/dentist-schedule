import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';

import { BookingDialogComponent, BookingDialogData } from '../components/booking-dialog/booking-dialog.component';
import { AppointmentProposal } from '../models/appointment-proposal.entity';
import { AppointmentsService } from '../services/appointments.service';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.css']
})
export class AppointmentsListComponent implements OnInit {

  private size = 20;

  freeAppointments: Observable<AppointmentProposal[]> | undefined;

  constructor(
    private appointmentsService: AppointmentsService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.freeAppointments = this.appointmentsService.getProposals(this.size);
  }

  book(proposal: AppointmentProposal) {
    let bookingDialog = this.dialog.open(BookingDialogComponent, {
      data: { proposal }
    });

    bookingDialog.afterClosed().subscribe(async (result: BookingDialogData) => {
      if (result) {
        try {
          const appointment = await firstValueFrom(this.appointmentsService.bookAppointment(result.proposal, result.clientName));
          this.router.navigate(['/appointment/' + appointment.id]);

        } catch(error) {
          alert(error);
        }
      }
    });
  }
}
