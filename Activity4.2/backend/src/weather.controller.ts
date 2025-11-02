import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather') // 👈 This defines the /weather route
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  getWeather(@Query('city') city: string) {
    return this.weatherService.getWeather(city);
  }
}
