import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto, organizerId: string): Promise<Event> {
    const event = new this.eventModel({
      ...createEventDto,
      organizerId,
    });
    return event.save();
  }

  async findAll(query?: any): Promise<Event[]> {
    const filter = {};

    if (query.search) {
      filter['$or'] = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { location: { $regex: query.search, $options: 'i' } },
      ];
    }

    return this.eventModel.find(filter).populate('organizerId', 'name email').exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).populate('organizerId', 'name email');
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async findByOrganizer(organizerId: string): Promise<Event[]> {
    return this.eventModel.find({ organizerId }).exec();
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string, userRole: string): Promise<Event> {
    const event = await this.findOne(id);

    // Check if user is the organizer or admin
    if (event.organizerId.toString() !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only update your own events');
    }

    return this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true }).exec();
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const event = await this.findOne(id);

    // Check if user is the organizer or admin
    if (event.organizerId.toString() !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only delete your own events');
    }

    await this.eventModel.findByIdAndDelete(id).exec();
  }

  async getCapacity(id: string): Promise<number> {
    const event = await this.findOne(id);
    return event.capacity;
  }
}