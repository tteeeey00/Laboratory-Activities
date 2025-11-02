import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: false, enum: ['personal', 'home', 'school'], default: 'personal' })
  category: string;
}

export type NoteDocument = Note & Document;
export const NoteSchema = SchemaFactory.createForClass(Note);

// ✅ Automatically rename _id to id when sending JSON responses
NoteSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});