import { Controller, Get, Post, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':eventId')
  create(@Param('eventId') eventId: string, @Request() req) {
    return this.registrationsService.create(eventId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string, @Request() req) {
    // Users can only see their own registrations
    if (req.user.userId !== userId && req.user.role !== UserRole.ADMIN) {
      return [];
    }
    return this.registrationsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.registrationsService.findByEvent(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/ticket')
  findOne(@Param('id') id: string, @Request() req) {
    return this.registrationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.registrationsService.cancel(id, req.user.userId);
  }
}