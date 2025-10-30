import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note, NoteSchema } from './note.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]), AuthModule],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
