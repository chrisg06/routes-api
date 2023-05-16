import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
