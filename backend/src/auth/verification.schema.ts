import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VerificationDocument = Verification & Document;

@Schema()
export class Verification {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
