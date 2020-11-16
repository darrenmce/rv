import { ActivityAnalyser } from './lib/ActivityAnalyser';
import { TCXParser } from './lib/TCXParser';
import path from 'path';

export type Services = {
  activityAnalyser: ActivityAnalyser
};

export async function createServices(): Promise<Services> {
  // TODO: make this not hardcoded
  const activity = (await TCXParser.createFromFilePath(path.resolve('test_data', '3629706178.tcx')))
    .getActivity();

  return {
    activityAnalyser: new ActivityAnalyser(activity)
  };
}
