import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.schema';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // 🟢 Get all tasks
  @Get()
  async getAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  // 🟦 Get a single task by ID
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Task | null> {
    return this.tasksService.findById(id);
  }

  // 🟩 Create a new task
  @Post()
  async create(@Body() task: Partial<Task>): Promise<Task> {
    return this.tasksService.create(task);
  }

  // 🟨 Update a task by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() task: Partial<Task>,
  ): Promise<Task | null> {
    return this.tasksService.update(id, task);
  }

  // 🟥 Delete a task by ID
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Task | null> {
    return this.tasksService.delete(id);
  }
}
