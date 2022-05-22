import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AppointmentProposal } from './appointment-proposal';

@Entity()
export class Appointment extends AppointmentProposal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    clientName: string;

    @Column()
    from: Date;

    @Column()
    to: Date;
}
