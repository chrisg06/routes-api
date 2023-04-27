import { Controller, Get, Res } from '@nestjs/common';
import * as https from 'https';
import { Response } from 'express'; 

function getFileContents(url: string): Promise<string> {
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

function createJson(fileContents: string) {
    try {
      const lines = fileContents.split("\n");
      const objects = lines.map(line => {
        const key = line.slice(0, 4);
        const value = line;
        if (key === '') return null; // exclude lines with empty keys
        return { [key]: value };
      }).filter(obj => obj !== null); // filter out excluded lines
      const json = JSON.stringify(objects);
      return json;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  
  

@Controller('weather')
export class WeatherController {  
    @Get('metars')  
    async getMetars(@Res() res: Response) {
        try {
            const fileUrl = "https://wx.vatpac.org/metars.txt"
            const fileContents = await getFileContents(fileUrl);
            const json = createJson(fileContents);
            res.set('Content-Type', 'application/json');
            res.send(json)
        } catch (err) {
            console.error(err)
            res.status(500).send('Internal Server Error');
        }
    }
}