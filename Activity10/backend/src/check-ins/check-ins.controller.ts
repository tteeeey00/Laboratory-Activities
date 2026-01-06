import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { CheckInsService } from './check-ins.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';

@Controller('check-ins')
export class CheckInsController {
  constructor(private readonly checkInsService: CheckInsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Post('scan')
  scan(@Body() body: { ticketCode: string }, @Request() req) {
    return this.checkInsService.scanTicket(body.ticketCode, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Post('manual')
  manualCheckIn(@Body() body: { registrationId: string }, @Request() req) {
    return this.checkInsService.manualCheckIn(body.registrationId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.checkInsService.findByEvent(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Get('stats/:eventId')
  getStats(@Param('eventId') eventId: string) {
    return this.checkInsService.getStats(eventId);
  }
}