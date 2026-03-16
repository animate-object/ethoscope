import type { BehaviorSchemaRecord } from '@/lib/schema/types'
import type { ObservationSession } from '@/lib/observation/types'
import { listSchemas } from '@/lib/schema/repository'
import { listSessions } from '@/lib/observation/repository'
import { downloadJson } from './download'

export interface EthoscopeExport {
  exportVersion: 1
  exportedAt: ISODateString
  schemas: BehaviorSchemaRecord[]
  sessions: ObservationSession[]
}

export function exportData(): void {
  const payload: EthoscopeExport = {
    exportVersion: 1,
    exportedAt: new Date().toISOString() as ISODateString,
    schemas: listSchemas(),
    sessions: listSessions(),
  }
  const date = new Date().toISOString().slice(0, 10)
  downloadJson(payload, `ethoscope-${date}.json`)
}
