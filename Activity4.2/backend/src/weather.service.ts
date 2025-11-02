import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  async getWeather(city: string) {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        this.logger.error('Weather API Error: API key is missing. Check your .env file.');
        throw new Error('Weather API key missing');
      }

      const response = await axios.get(this.baseUrl, {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric',
        },
      });

      const data = response.data;
      return {
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        condition: data.weather[0].description,
        timezone: data.timezone,
      };
    } catch (error) {
      this.logger.error('Weather API Error:', error.message);
      return { error: 'City not found or API request failed.' };
    }
  }
}
