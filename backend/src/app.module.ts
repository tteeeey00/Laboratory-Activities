import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';
import * as dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI is not defined in your .env file');
}

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    TasksModule,
  ],
})
export class AppModule {}
