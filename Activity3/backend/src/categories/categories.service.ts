import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  create(data: any) {
    const category = new this.categoryModel(data);
    return category.save();
  }

  findAll() {
    return this.categoryModel.find().exec();
  }

  findOne(id: string) {
    return this.categoryModel.findById(id).exec();
  }

  update(id: string, data: any) {
    return this.categoryModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  remove(id: string) {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }
}
