export const ROUTES = {
  home: '/',
  behaviorSchemas: '/behavior-schemas',
  behaviorSchema: '/behavior-schema',
  behaviorSchemaEdit: (id: string) => `/behavior-schema/${id}`,
  observationNew: '/observation',
  observationSession: (schemaId: string) => `/observation/${schemaId}`,
  observationComplete: '/observation/complete',
  analysis: '/analysis',
  analysisSession: (id: string) => `/analysis/session/${id}`,
  options: '/options',
  devTools: '/options/dev-tools',
} as const

/** Where to navigate after a session ends. Edit here to change post-session flow. */
export const POST_SESSION_DESTINATIONS = {
  primary: ROUTES.home,
  secondary: ROUTES.analysis,
} as const
