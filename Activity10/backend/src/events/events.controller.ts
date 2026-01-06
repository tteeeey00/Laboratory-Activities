import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.userId);
  }

  @Get()
  findAll(@Query() query) {
    return this.eventsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('organizer/:id')
  findByOrganizer(@Param('id') id: string, @Request() req) {
    // Allow organizers to see their own events, admins to see all
    if (req.user.role === UserRole.ADMIN || req.user.userId === id) {
      return this.eventsService.findByOrganizer(id);
    }
    return [];
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req) {
    return this.eventsService.update(id, updateEventDto, req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.eventsService.remove(id, req.user.userId, req.user.role);
  }
}