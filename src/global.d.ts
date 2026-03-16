/** A value that may or may not be present — no import needed. */
type Maybe<T> = T | null | undefined

/** Marks a type as not yet resolved */
type Pending<T> = T | undefined

/** A record with string keys and uniform value type */
type Dict<T> = Record<string, T>

/** Makes specified keys required, leaving the rest as-is */
type Require<T, K extends keyof T> = T & Required<Pick<T, K>>

/** Makes specified keys optional, leaving the rest as-is */
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/** A branded type for nominal typing */
type Brand<T, B extends string> = T & { readonly __brand: B }

// Timestamp convention: all timestamps are ISO 8601 strings in UTC unless explicitly noted otherwise.
type ISODateString = Brand<string, 'ISODateString'>

declare const __COMMIT_DATE__: string
