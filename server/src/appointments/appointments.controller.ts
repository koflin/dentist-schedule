import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService
  ) {}

  @Get('/proposals')
  findAllProposals(@Query('size') size: number) {
    return this.appointmentsService.calculateProposals(size);
  }

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Delete('reset')
  deleteAll() {
    return this.appointmentsService.removeAll();
  }
}
