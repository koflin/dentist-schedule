import { AppointmentProposal } from './appointment-proposal.entity';

export interface Appointment extends AppointmentProposal {
  id: number;
  clientName: string;
}
