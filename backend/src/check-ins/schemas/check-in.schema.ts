import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CheckInDocument = CheckIn & Document;

export enum CheckInMethod {
  QR = 'qr',
  MANUAL = 'manual',
}

@Schema({ timestamps: true })
export class CheckIn {
  @Prop({ type: Types.ObjectId, ref: 'Registration', required: true })
  registrationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  scannedBy: Types.ObjectId;

  @Prop({ required: true, enum: CheckInMethod, default: CheckInMethod.QR })
  method: CheckInMethod;

  scannedAt: Date;
}

export const CheckInSchema = SchemaFactory.createForClass(CheckIn);