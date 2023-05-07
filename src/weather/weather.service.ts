import { Injectable } from '@nestjs/common';
import * as https from 'https';
import * as http from 'http';
import { json } from 'stream/consumers';

@Injectable()
export class WeatherService {
  async getFileContents(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(data);
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  createJson(fileContents: string, search: string, type: string) {
    try {
      const lines = fileContents.split("\n");
      let objects = lines.map(line => {
        const key = type === 'metar' ? line.slice(0, 4) : line.slice(4, 8);
        const value = line;
        if (key === '') return null; // exclude lines with empty keys
        return { [key]: value };
      }).filter(obj => obj !== null); // filter out excluded lines
      if (search) { 
        const searchRegex = new RegExp(search, 'i');
        objects = objects.filter(obj => {
          const value = Object.values(obj)[0];
          return searchRegex.test(value);
        })
      }
      const json = JSON.stringify(objects);
      return json;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  createIcaoJson(MetarFileContents: string, TafFileContents: string, icao: string) {
    try {
      const Metarlines = MetarFileContents.split("\n");
      const TafLines = TafFileContents.split("\n");
      const searchRegex = new RegExp(icao, 'i');
  
      // Find the Metar object that matches the ICAO code
      const metarObj = Metarlines.reduce((acc, line) => {
        const value = line;
        if (searchRegex.test(value)) {
          acc = value;
        }
        return acc;
      }, 'No Metar Available');
  
      // Find the Taf object that matches the ICAO code
      const tafObj = TafLines.reduce((acc, line) => {
        const value = line;
        if (searchRegex.test(value)) {
          acc = value;
        }
        return acc;
      }, 'No TAF Available');
  
      // Create the final JSON object
      const jsonObj = {
        icao: icao.toUpperCase(),
        weather: {
          metar: metarObj,
          taf: tafObj
        }
      };
  
      return JSON.stringify(jsonObj);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  
}
