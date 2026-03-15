import { generateHue } from '../color'
import {
  SCHEMA_DEFINITION_SPEC_VERSIONS,
  type BehaviorSchemaRecord,
  type KnownSchemaEvents,
  type SimpleUserBehaviorEvent,
  type SimpleUserDefinedSchemaValue,
} from './types'

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function createSchemaValue(name: string): SimpleUserDefinedSchemaValue {
  return {
    name,
    slug: slugify(name),
    id: crypto.randomUUID(),
  }
}

export function createEvent(name: string): SimpleUserBehaviorEvent {
  return {
    ...createSchemaValue(name),
    type: 'v1-simple-event',
    colorHue: generateHue(),
  }
}

export function createTag(name: string): SimpleUserDefinedSchemaValue {
  return createSchemaValue(name)
}

export function createSchema(name: string): BehaviorSchemaRecord {
  return {
    schemaDefinitionSpecVersion: SCHEMA_DEFINITION_SPEC_VERSIONS.ONE,
    version: {
      absolute: 1,
      authoredAt: new Date().toISOString() as ISODateString,
    },
    name: createSchemaValue(name),
    events: [] as KnownSchemaEvents[],
  }
}

export function bumpVersion(schema: BehaviorSchemaRecord): BehaviorSchemaRecord {
  return {
    ...schema,
    version: {
      absolute: schema.version.absolute + 1,
      authoredAt: new Date().toISOString() as ISODateString,
    },
  }
}
