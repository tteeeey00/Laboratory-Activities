import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author, AuthorDocument } from './schemas/author.schema';

@Injectable()
export class AuthorsService {
  constructor(@InjectModel(Author.name) private authorModel: Model<AuthorDocument>) {}

  create(data: any) {
    const author = new this.authorModel(data);
    return author.save();
  }

  findAll() {
    return this.authorModel.find().exec();
  }

  findOne(id: string) {
    return this.authorModel.findById(id).exec();
  }

  update(id: string, data: any) {
    return this.authorModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  remove(id: string) {
    return this.authorModel.findByIdAndDelete(id).exec();
  }
}
