import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Author extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  bio: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
export type AuthorDocument = Author & Document;
