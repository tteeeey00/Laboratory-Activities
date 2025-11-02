import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 📄 Ito ang data structure na mase-save sa MongoDB
@Schema()
export class Weather extends Document {
  @Prop() city: string; // pangalan ng lungsod
  @Prop() country: string; // ISO country code (e.g. PH, JP, US)
  @Prop() temperature: number; // temperatura sa Celsius
  @Prop() condition: string; // weather condition (e.g. few clouds)
  @Prop({ default: Date.now }) createdAt: Date; // auto save ng date/time
}

// 🏗️ Gumagawa ng schema base sa class sa taas
export const WeatherSchema = SchemaFactory.createForClass(Weather);
