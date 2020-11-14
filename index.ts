import { parseStringPromise } from 'xml2js';
import * as fs from 'fs';
import * as util from 'util';
import path from 'path';
import { type } from 'os';

const readFile = util.promisify(fs.readFile);

type ActivityTime = {
  startDatetime: Date,
}

type ActivityStats = {
  totalTimeSeconds: number
  distanceMeters: number,
  maximumSpeedMetersPerSecond: number,
  calories: number,
  avgHeartRateBpm: number,
  maximumHeartRateBpm: number
}

type ActivityTrackItem = {
  time: Date,
  position?: {
    altitudeMeters: number,
    lat: number,
    long: number
  }
  distanceMeters?: number,
  heartRateBpm?: number,
}

type Activity = {
  id: string,
  sport: string,
  time: ActivityTime
  stats: ActivityStats
  track: ActivityTrackItem[]
}

function getValue(val: any): string {
  console.log('getValue', val);
  if (val === undefined) {
    return '';
  }

  if (typeof val === 'string') {
    return val;
  }

  if (val instanceof Array) {
    return getValue(val[0]);
  }

  if (typeof val === 'object') {
    return getValue(val.Value);
  }

  console.error('val', val);
  throw new Error('dont know how to get value');
}

class TCXParser {
  public fileData: string = '';
  public xmlData: any = {};

  public static async createFromFilePath(path: string): Promise<TCXParser> {
    const parser = new TCXParser();

    await parser.loadFile(path);

    return parser;
  }

  public async loadFile(path: string): Promise<void> {
    if (this.fileData) {
      throw new Error('cannot load a file more than once');
    }
    this.fileData = await readFile(path, { encoding: 'utf8' })
    this.xmlData = await parseStringPromise(this.fileData);
  }

  public getActivity(): Activity {
    const d = this.xmlData.TrainingCenterDatabase;

    const tcxActivity = d.Activities[0].Activity[0];
    const tcxLap = tcxActivity.Lap[0];
    const tcxTrack = tcxActivity.Track;

    return {
      id: getValue(tcxActivity.Id).toString(),
      sport: getValue(tcxActivity?.$?.Sport).toString(),
      time: {
        startDatetime: tcxLap?.$?.StartTime
      },
      stats: {
        avgHeartRateBpm: parseFloat(getValue(tcxLap.AverageHeartRateBpm)),
        calories: parseFloat(getValue(tcxLap.Calories)),
        distanceMeters: parseFloat(getValue(tcxLap.DistanceMeters)),
        maximumHeartRateBpm: parseFloat(getValue(tcxLap.MaximumHeartRateBpm)),
        maximumSpeedMetersPerSecond: parseFloat(getValue(tcxLap.MaximumSpeed)),
        totalTimeSeconds: parseFloat(getValue(tcxLap.TotalTimeSeconds)),
      },
      track: []
    }
  }
}

async function main() {
  const testTcx = await TCXParser.createFromFilePath(path.resolve(__dirname, 'test_data', '3629706178.tcx'));

  console.log(testTcx.fileData.length);
  // console.log(testTcx.xmlData);
  // fs.writeFileSync('test.json', JSON.stringify(testTcx.xmlData));
  console.log(testTcx.getActivity());
}

main();
