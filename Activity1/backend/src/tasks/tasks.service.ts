import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  // 🟢 Get all tasks
  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  // 🟦 Get a single task by ID
  async findById(id: string): Promise<Task | null> {
    return this.taskModel.findById(id).exec();
  }

  // 🟩 Create new task
  async create(task: Partial<Task>): Promise<Task> {
    const newTask = new this.taskModel(task);
    return newTask.save();
  }

  // 🟨 Update a task
  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    return this.taskModel.findByIdAndUpdate(id, task, { new: true }).exec();
  }

  // 🟥 Delete a task
  async delete(id: string): Promise<Task | null> {
    return this.taskModel.findByIdAndDelete(id).exec();
  }
}
