import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { assert } from 'console';
import { from } from 'rxjs';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentProposal } from './entities/appointment-proposal';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepo: Repository<Appointment>,
    private config: ConfigService
  ) {
  }

  async create(createAppointmentDto: CreateAppointmentDto) {
    const createAppointmentFrom = new Date(createAppointmentDto.from);
    const createAppointmentTo = new Date(new Date(createAppointmentDto.to).getTime() - 1);

    const appointment = await this.appointmentsRepo.findOne({
      where: [{
        from: Between(createAppointmentFrom, createAppointmentTo)
      }, {
        to: Between(createAppointmentFrom, createAppointmentTo)
      }]
    });

    if (appointment) throw new BadRequestException('Appointment already booked');

    const newAppointment = new Appointment(createAppointmentFrom, createAppointmentTo);
    newAppointment.clientName = createAppointmentDto.clientName;

    return this.appointmentsRepo.save(newAppointment);
  }

  findAll() {
    return this.appointmentsRepo.find({where: { from: MoreThanOrEqual(new Date()) }});
  }

  findOne(id: number) {
    return this.appointmentsRepo.findOne(id);
  }

  removeAll() {
    return this.appointmentsRepo.clear();
  }

  async calculateProposals(size: number) {
    const bookedAppointments = await this.findAll();
    const proposals: AppointmentProposal[] = [];

    // Normalize date now to next 30 minute slot
    const dateNowNormalized = new Date();
    dateNowNormalized.setMinutes(dateNowNormalized.getMinutes() + 1, 0, 0);
    const minutesNow = dateNowNormalized.getMinutes();
    if (minutesNow > 0 && minutesNow < 29) {
      dateNowNormalized.setMinutes(30);
    } else {
      dateNowNormalized.setHours(dateNowNormalized.getHours() + 1, 0);
    }

    let currentProposal;
    let currentProposalEnd = dateNowNormalized;

    // Get desired amount of proposals
    for (let i = 0; i < size; i++) {

      // Fetch next proposal until one has been found that is not occupied
      do {
        currentProposal = currentProposalEnd;
        currentProposal = this.getNextProposal(currentProposal);
        currentProposalEnd = new Date(currentProposal);
        currentProposalEnd.setMinutes(currentProposal.getMinutes() + 30);

      } while (bookedAppointments.findIndex(
        (appointment) => (currentProposal >= appointment.from && currentProposal < appointment.to) || (currentProposalEnd > appointment.from && currentProposalEnd <= appointment.to)
      ) != -1);

      proposals.push(new AppointmentProposal(currentProposal, currentProposalEnd));
    }

    return proposals;
  }

  private getNextProposal(lastTo: Date) {
    assert((lastTo.getMinutes() == 0 || lastTo.getMinutes() == 30) && lastTo.getSeconds() == 0 && lastTo.getMilliseconds() == 0);

    // Border dates
    const dayStartDate = new Date(lastTo);
    dayStartDate.setHours(this.config.get('DAY_START'), 0, 0, 0);

    const dayEndDate = new Date(lastTo);
    dayEndDate.setHours(this.config.get('DAY_END') - 1, 30, 0, 0);

    const lunchStartDate = new Date(lastTo);
    lunchStartDate.setHours(this.config.get('LUNCH_START') - 1, 30, 0, 0);

    const lunchEndDate = new Date(lastTo);
    lunchEndDate.setHours(this.config.get('LUNCH_END'), 0, 0, 0);

    // Get next space slot
    if (lastTo <= dayStartDate) return dayStartDate;
    if (lastTo > lunchStartDate && lastTo <= lunchEndDate) return lunchEndDate;
    if (lastTo > dayEndDate) return new Date(dayStartDate.setDate(dayStartDate.getDate() + 1));
    
    return lastTo;
  }
}
