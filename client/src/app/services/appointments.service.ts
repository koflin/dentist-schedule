import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AppointmentProposal } from '../models/appointment-proposal.entity';
import { Appointment } from '../models/appointment.entity';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  private baseUrl = environment.apiBaseUrl + '/appointments';

  constructor(private http: HttpClient) {

  }

  getProposals(size: number) {
    return this.http.get<AppointmentProposal[]>(this.baseUrl + '/proposals?size=' + size).pipe(
      map(data => data.map(proposal => {
        return { from: new Date(proposal.from), to: new Date(proposal.to) };
      }))
    );
  }

  getAppointment(id: number) {
    return this.http.get<Appointment>(this.baseUrl + '/' + id);
  }

  bookAppointment(proposal: AppointmentProposal, clientName: string) {
    return this.http.post<Appointment>(this.baseUrl, <Appointment>{ ...proposal, clientName });
  }

  reset() {
    return this.http.delete(this.baseUrl + '/reset');
  }
}
