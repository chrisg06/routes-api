import { Injectable } from '@nestjs/common';
import * as https from 'https';
import * as http from 'http';

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

  async getFileContentsHttp(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      http.get(url, (res) => {
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
}
