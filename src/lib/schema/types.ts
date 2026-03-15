// See ./README.md for domain context and intent.

// user authored data ought to be kept relatively simple
// this is a general utility for any user generated name in the
// schema which gets its own slug and ID provided by the system
// the slug and ID are 'locked in' once the value is authored,
// even if the name changes. the only difference between the
// slug and id is the slug is meant to be human readable e.g.
// in routes
export interface SimpleUserDefinedSchemaValue {
  // display value. conceptually unique
  name: string
  // slugified value
  slug: string
  // uuid, unique1
  id: string
}

interface BaseEvent {
  type: string
}

export interface SimpleUserBehaviorEvent extends SimpleUserDefinedSchemaValue, BaseEvent {
  type: 'v1-simple-event'
  // Hue value (0–359) used to derive both the event color and tag tones.
  // Stored as a number so tones can be computed without string parsing.
  colorHue: number
  tags?: SimpleUserDefinedSchemaValue[]
}

export type KnownSchemaEvents = SimpleUserBehaviorEvent // | SomeFutureEvent | SomeFutureEvent

// Hard upper limit on events per schema to keep the observation interface simple.
export const MAX_EVENTS = 6

// Hard upper limit on tags per event. Kept separate from MAX_EVENTS as these
// limits serve different UX concerns and may diverge independently.
export const MAX_TAGS = 4

// users can define many schemas, but they must all comply
// to the schema definition spec, which may evolve over time
// this is an app internal concept that can be used, e.g.
// to identify out of date versions and migrate, if the need arises
export const SCHEMA_DEFINITION_SPEC_VERSIONS = {
  // most basic definition supports 'two tiered' user defined events
  ONE: 1,
}

// Represents changes to a given user schema over time
export interface UserSchemaVersion {
  absolute: number // autoinc from 1
  authoredAt: ISODateString
}

export interface BehaviorSchemaRecord {
  schemaDefinitionSpecVersion: number
  version: UserSchemaVersion
  name: SimpleUserDefinedSchemaValue
  events: KnownSchemaEvents[]
}
