import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Weather } from './weather.schema'; // ✅ import schema class

dotenv.config();

@Injectable()
export class WeatherService {
  constructor(@InjectModel(Weather.name) private weatherModel: Model<Weather>) {}

  async getWeather(city: string) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      const result = {
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        condition: data.weather[0].description,
      };

      // 💾 I-save sa MongoDB
      await this.weatherModel.create(result);

      return result;
    } catch (error) {
      return { error: 'City not found or API error.' };
    }
  }
}
