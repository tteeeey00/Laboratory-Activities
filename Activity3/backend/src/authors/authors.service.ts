import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from './schemas/author.schema';

@Injectable()
export class AuthorsService {
  constructor(@InjectModel(Author.name) private readonly authorModel: Model<Author>) {}

  async create(data: any) {
    const created = new this.authorModel(data);
    return created.save();
  }

  async findAll() {
    return this.authorModel.find().exec();
  }

  async findOne(id: string) {
    return this.authorModel.findById(id).exec();
  }

  async update(id: string, data: any) {
    return this.authorModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string) {
    return this.authorModel.findByIdAndDelete(id).exec();
  }
}
