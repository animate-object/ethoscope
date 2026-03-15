export interface ObservationEntry {
  behaviorId: string
  tagId?: string
  timestamp: ISODateString
}

export interface ObservationSession {
  id: string
  schemaId: string
  startedAt: ISODateString
  endedAt?: ISODateString
  observations: ObservationEntry[]
}
