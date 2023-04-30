import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('metars')
  async getMetars(@Res() res: Response, @Query('search') search: string) {
    try {
      const fileUrl = 'https://wx.vatpac.org/metars.txt';
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
      const fileUrl = 'http://localhost:8080/tafs.txt';
      const fileContents = await this.weatherService.getFileContentsHttp(
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
