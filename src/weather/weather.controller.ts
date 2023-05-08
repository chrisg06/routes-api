import { Controller, Get, Res, Query, Param } from '@nestjs/common';
import { Response } from 'express';
import { WeatherService } from './weather.service';
import { ConfigService } from '@nestjs/config';

@Controller('weather')
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly configService: ConfigService,
    ) {}

  @Get(':icao')
  async GetIcaoWeather(@Param('icao') icao: string, @Res() res: Response) {
    try {
      const baseUrl = this.configService.get('WEATHER_BASE_URL');
      const MetarFileUrl = `${baseUrl}/metars.txt`;
      const TafFileUrl = `${baseUrl}/tafs.txt`;
      const MetarFileContents = await this.weatherService.getFileContents(MetarFileUrl);
      const TafFileContents = await this.weatherService.getFileContents(TafFileUrl);
      const json = this.weatherService.createIcaoJson(MetarFileContents, TafFileContents, icao);
      res.set('Content-Type', 'application/json');
      res.send(json);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }

  @Get('metars')
  async getMetars(@Res() res: Response, @Query('search') search: string) {
    try {
      const fileUrl = `${this.configService.get('WEATHER_BASE_URL')}/metars.txt`;
      const fileContents = await this.weatherService.getFileContents(fileUrl);
      const json = this.weatherService.createJson(
        fileContents,
        search,
        'metar',
      );
      res.set('Content-Type', 'application/json');
      res.send(json);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }

  @Get('tafs')
  async getTafs(@Res() res: Response, @Query('search') search: string) {
    try {
      const fileUrl = `${this.configService.get('WEATHER_BASE_URL')}/tafs.txt`;
      const fileContents = await this.weatherService.getFileContents(
        fileUrl,
      );
      const json = this.weatherService.createJson(fileContents, search, 'taf');
      res.set('Content-Type', 'application/json');
      res.send(json);
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  }
}
