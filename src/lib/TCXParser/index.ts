import { parseStringPromise } from 'xml2js';
import * as fs from 'fs';
import * as util from 'util';
import { Activity, ActivityTrackPoint } from '../../types/activity';
import { TCXXML } from './types';

const readFile = util.promisify(fs.readFile);

export class TCXParser {
  public fileData: string = '';
  public xmlData: TCXXML | undefined;

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
    this.xmlData = await parseStringPromise(this.fileData, { explicitArray: false });
  }

  public getActivity(): Activity {
    if (!this.xmlData) {
      throw new Error('must load TCX file first');
    }
    const d = this.xmlData.TrainingCenterDatabase;

    const tcxActivity = d.Activities.Activity;
    const tcxLap = tcxActivity.Lap;
    const tcxPoints = tcxLap.Track.Trackpoint;

    return {
      id: tcxActivity.Id,
      sport: tcxActivity.$.Sport,
      time: {
        startDatetime: new Date(tcxLap.$.StartTime)
      },
      stats: {
        avgHeartRateBpm: parseFloat(tcxLap.AverageHeartRateBpm.Value),
        calories: parseFloat(tcxLap.Calories),
        distanceMeters: parseFloat(tcxLap.DistanceMeters),
        maximumHeartRateBpm: parseFloat(tcxLap.MaximumHeartRateBpm.Value),
        maximumSpeedMetersPerSecond: parseFloat(tcxLap.MaximumSpeed),
        totalTimeSeconds: parseFloat(tcxLap.TotalTimeSeconds)
      },
      track: tcxPoints.map(
        ({
           AltitudeMeters,
           DistanceMeters,
           HeartRateBpm,
           Position,
           Time
         }): ActivityTrackPoint => ({
          time: new Date(Time),
          distanceMeters: DistanceMeters ? parseFloat(DistanceMeters) : undefined,
          heartRateBpm: HeartRateBpm ? parseFloat(HeartRateBpm.Value) : undefined,
          altitudeMeters: AltitudeMeters ? parseFloat(AltitudeMeters) : undefined,
          position: Position ? {
            lat: parseFloat(Position.LatitudeDegrees),
            lng: parseFloat(Position.LongitudeDegrees)
          }: undefined
        }))
    }
  }
}
