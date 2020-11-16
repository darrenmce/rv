import { Activity } from '../../types/activity';

export class ActivityAnalyser {
  constructor(
    public activity: Activity
  ) {
  }

  public async getActivityAnalysis() {
    return this.activity;
  }
}
