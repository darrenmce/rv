export type ActivityTime = {
  startDatetime: Date,
}

export type ActivityStats = {
  totalTimeSeconds: number
  distanceMeters: number,
  maximumSpeedMetersPerSecond: number,
  calories: number,
  avgHeartRateBpm: number,
  maximumHeartRateBpm: number
}

export type ActivityTrackPoint = {
  time: Date,
  position: {
    altitudeMeters?: number,
    lat?: number,
    long?: number
  }
  distanceMeters?: number,
  heartRateBpm?: number,
}

export type Activity = {
  id: string,
  sport: string,
  time: ActivityTime
  stats: ActivityStats
  track: ActivityTrackPoint[]
}
