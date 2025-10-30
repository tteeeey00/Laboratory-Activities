import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note, NoteDocument } from './note.schema';
import { Model } from 'mongoose';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async findAllByUser(userId: string) {
    return this.noteModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async create(userId: string, dto: { title: string; content: string }) {
    const n = new this.noteModel({ ...dto, userId });
    return n.save();
  }

  async updateByUser(id: string, dto: Partial<Note>, userId: string) {
    return this.noteModel.findOneAndUpdate({ _id: id, userId }, dto, { new: true }).exec();
  }

  async deleteByUser(id: string, userId: string) {
    return this.noteModel.findOneAndDelete({ _id: id, userId }).exec();
  }
}
