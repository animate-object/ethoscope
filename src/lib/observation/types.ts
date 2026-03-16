export interface ObservationEntry {
  behaviorId: string
  tagId?: string
  timestamp: ISODateString
}

export interface ObservationSession {
  id: string
  schemaId: string
  schemaVersion: number
  timezone: string
  startedAt: ISODateString
  endedAt?: ISODateString
  observations: ObservationEntry[]
}
