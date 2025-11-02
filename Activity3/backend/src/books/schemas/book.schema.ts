import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Book extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  author: string;

  @Prop()
  category: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
export type BookDocument = Book & Document;
