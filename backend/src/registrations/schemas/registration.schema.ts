import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RegistrationDocument = Registration & Document;

export enum RegistrationStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Registration {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  ticketCode: string;

  @Prop({ required: true })
  qrCodeUrl: string;

  @Prop({ required: true, enum: RegistrationStatus, default: RegistrationStatus.CONFIRMED })
  status: RegistrationStatus;

  registeredAt: Date;
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);