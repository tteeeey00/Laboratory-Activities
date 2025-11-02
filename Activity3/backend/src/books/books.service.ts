import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './schemas/book.schema';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private readonly bookModel: Model<Book>) {}

  async create(data: any) {
    const createdBook = new this.bookModel(data);
    return createdBook.save();
  }

  async findAll() {
    return this.bookModel.find().populate('author').populate('category').exec();
  }

  async findOne(id: string) {
    return this.bookModel.findById(id).populate('author').populate('category').exec();
  }

  async update(id: string, data: any) {
    return this.bookModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string) {
    return this.bookModel.findByIdAndDelete(id).exec();
  }
}
