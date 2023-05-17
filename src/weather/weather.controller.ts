import { Controller, Get, Res, Query, Param } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

import { WeatherService } from './weather.service';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Endpoint to search for a specific icao, and return the weather as individual elements to allow easy use in the frontend
   * @param icao
   * @param res
   */
  @Get('search/:icao')
  async getIcaoWeather(@Param('icao') icao: string, @Res() res: Response) {
    try {
      const pattern = new RegExp(/^Y\w{3}$/, 'i');
      const isAus = pattern.test(icao);

      let baseUrl = this.configService.get('VATPAC_WEATHER_BASE_URL');
      let MetarFileUrl = `${baseUrl}/metars.txt`;
      const TafFileUrl = `${baseUrl}/tafs.txt`;

      if (!isAus) {
        baseUrl = this.configService.get('VATSIM_WEATHER_BASE_URL');
        MetarFileUrl = `${baseUrl}/${icao}`;
      }
      const MetarFileContents = await this.weatherService.getFileContents(
        MetarFileUrl,
      );
      const TafFileContents = await this.weatherService.getFileContents(
        TafFileUrl,
      );
      const json = this.weatherService.createIcaoJson(
        MetarFileContents,
        TafFileContents,
        icao,
      );
      res.set('Content-Type', 'application/json');
      res.send(json);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }

  /**
   * Endpoint to return all Australian Metars, with an optional search parameter. Multiple ICAOs can be searched by comma separating them.
   * @param res
   * @param search Optional ICAO search parameter
   */

  @ApiQuery({ name: 'search', required: false })
  @Get('metars')
  async getMetars(@Res() res: Response, @Query('search') search: string) {
    try {
      const fileUrl = `${this.configService.get(
        'VATPAC_WEATHER_BASE_URL',
      )}/metars.txt`;
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

  /**
   * Endpoint to return all Australian TAFs, with an optional search parameter. Multiple ICAOs can be searched by comma separating them.
   * @param res
   * @param search Optional ICAO search parameter
   */
  @ApiQuery({ name: 'search', required: false })
  @Get('tafs')
  async getTafs(@Res() res: Response, @Query('search') search: string) {
    try {
      const fileUrl = `${this.configService.get(
        'VATPAC_WEATHER_BASE_URL',
      )}/tafs.txt`;
      const fileContents = await this.weatherService.getFileContents(fileUrl);
      const json = this.weatherService.createJson(fileContents, search, 'taf');
      res.set('Content-Type', 'application/json');
      res.send(json);
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  }
}
