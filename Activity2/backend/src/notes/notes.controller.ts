import { Controller, Post, Body, Get, UseGuards, Req, Param, Delete, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotesService } from './notes.service';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  async create(@Req() req, @Body() body: { title: string; content: string }) {
    const userId = req.user?.userId;
    return this.notesService.create(userId, body);
  }

  @Get()
  async findAll(@Req() req) {
    const userId = req.user?.userId;
    return this.notesService.findAllByUser(userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req) {
    const userId = req.user?.userId;
    return this.notesService.updateByUser(id, body, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const userId = req.user?.userId;
    return this.notesService.deleteByUser(id, userId);
  }
}
