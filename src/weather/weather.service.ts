import { Injectable } from '@nestjs/common';
import * as https from 'https';

@Injectable()
export class WeatherService {
  async getFileContents(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            resolve(data);
          });
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }

  createJson(fileContents: string, search: string, type: string) {
    try {
      const lines = fileContents.split('\n');
      let objects = lines
        .map((line) => {
          const key = type === 'metar' ? line.slice(0, 4) : line.slice(4, 8);
          const value = line;
          if (key === '') return null; // exclude lines with empty keys
          return { [key]: value };
        })
        .filter((obj) => obj !== null); // filter out excluded lines
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        objects = objects.filter((obj) => {
          const value = Object.values(obj)[0];
          return searchRegex.test(value);
        });
      }
      const json = JSON.stringify(objects);
      return json;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  createIcaoJson(
    MetarFileContents: string,
    TafFileContents: string,
    icao: string,
  ) {
    try {
      const Metarlines = MetarFileContents.split('\n');
      const TafLines = TafFileContents.split('\n');
      const searchRegex = new RegExp(icao, 'i');

      // Find the Metar object that matches the ICAO code
      const metarObj = Metarlines.reduce((acc, line) => {
        const value = line;
        if (searchRegex.test(value)) {
          acc = value;
        }
        return acc;
      }, 'No Metar Available');

      // extract wind data from the metar object
      let wind = null;
      let windDirection = null;
      let windSpeed = null;
      const windMatch = metarObj.match(/(\d{3}|VRB)(\d{2,3})(G(\d{2,3}))?KT/);
      if (windMatch) {
        wind = windMatch[0];
        const windDirectionMatch = wind.match(/\d{3}/);
        windDirection = windDirectionMatch[0];
        const windSpeedMatch = wind.match(/(\d{2})(G(\d{2,3}))?KT/);
        windSpeed = windSpeedMatch[0];
      }

      // extract visibility data from the metar object
      let vis = null;
      const visMatch = metarObj.match(/\b\d+(?:\s*\d+\/\d+)?SM?\b|\b\d{4}\b/);
      if (visMatch) {
        vis = visMatch[0];
      }

      // extract cloud data from the metar object
      let cldArray = [];
      const cldMatch = metarObj.match(
        /\b([A-Z]{3})(\d{3}|\/\/\/)([A-Z]{2,3})?\b/g,
      );
      if (cldMatch) {
        cldMatch.forEach((match) => cldArray.push(match));
      } else {
        cldArray = null;
      }

      // extract weather data from the metar object
      let wx = null;
      const wxArray = [];
      const cavokMatch = metarObj.match(/\bCAVOK\b/);

      if (cavokMatch) {
        wx = ['CAVOK'];
      } else {
        const wxMatch = metarObj.match(
          /(?:\s|\b)((?:\+|-|VC)?(?:SH|TS|FZ)?(?:DZ|RA|SN|GR|GS|UP|PL|SG|IC|BR|FG|FU|VA|DU|SA|HZ|PY|PO|SQ|FC|SS|DS))(?=\s|\b)/g,
        );
        if (wxMatch) {
          wxMatch.forEach((match) => wxArray.push(match));
          wx = wxArray;
        }
      }

      //extract temperature data from the metar object
      let temp = null;
      const tempMatch = metarObj.match(/\b(M?\d{2})\b/);
      if (tempMatch) {
        temp = tempMatch[0];
      }

      //extract dewpoint data from the metar object
      let dewpoint = null;
      const dewpointMatch = metarObj.match(/\/\b(M?\d{2})\b/);
      if (dewpointMatch) {
        dewpoint = dewpointMatch[1];
      }

      //extract qnh data from the metar object
      let qnh = null;
      const qnhMatch = metarObj.match(/(A|Q)(\d{4})/);
      if (qnhMatch) {
        qnh = qnhMatch[0];
      }

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
        metar: metarObj,
        taf: tafObj,
        weather: {
          wind: {
            raw: wind,
            direction: windDirection,
            speed: windSpeed,
          },
          wx: {
            wx: wx,
            vis: vis,
            cld: cldArray,
          },
          temp: temp,
          dewpoint: dewpoint,
          qnh: qnh,
        },
      };

      return JSON.stringify(jsonObj);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
