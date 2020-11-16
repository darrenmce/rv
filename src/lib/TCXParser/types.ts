export type TCXValue = { Value: string };

export type TCXPosition = {
  LatitudeDegrees: string,
  LongitudeDegrees: string
}

export type TCXTrackPoint = {
  Time: string,
  AltitudeMeters?: string,
  DistanceMeters?: string,
  HeartRateBpm?: TCXValue,
  Position?: TCXPosition
}

export type TCXLap = {
  $: {
    StartTime: string
  },
  TotalTimeSeconds: string,
  DistanceMeters: string,
  MaximumSpeed: string,
  Calories: string,
  AverageHeartRateBpm: TCXValue,
  MaximumHeartRateBpm: TCXValue,
  Intensity: string,
  TriggerMethod: string,
  Track: {
    Trackpoint: TCXTrackPoint[]
  }
}

export type TCXActivity = {
  $: {
    Sport: string
  },
  Id: string,
  Lap: TCXLap
}

export type TCXXML = {
  TrainingCenterDatabase: {
    $: any,
    Activities: { Activity: TCXActivity }
  }
}
