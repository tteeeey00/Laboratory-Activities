import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  create(data: any) {
    const createdBook = new this.bookModel(data);
    return createdBook.save();
  }

  findAll() {
    return this.bookModel.find().exec();
  }

  findOne(id: string) {
    return this.bookModel.findById(id).exec();
  }

  update(id: string, data: any) {
    return this.bookModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  remove(id: string) {
    return this.bookModel.findByIdAndDelete(id).exec();
  }
}
