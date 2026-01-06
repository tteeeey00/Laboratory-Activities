import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Post('send')
  sendNotification(@Body() body: { to: string; subject: string; message: string }) {
    return this.notificationsService.sendNotification(body.to, body.subject, body.message);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Get('templates')
  getTemplates() {
    return this.notificationsService.getTemplates();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @Post('bulk')
  sendBulkNotification(@Body() body: { eventId: string; subject: string; message: string }) {
    return this.notificationsService.sendBulkNotification(body.eventId, body.subject, body.message);
  }
}