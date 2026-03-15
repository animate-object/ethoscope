const en = {
  home: {
    title: 'Ethoscope',
    nav: {
      newBehaviorSchema: 'New Behavior Schema',
      newBehaviorSchemaDescription: 'Define and structure observable behaviors',
      viewBehaviorSchemas: 'Behavior Schemas',
      viewBehaviorSchemasDescription: 'View and edit your behavior schemas',
      startObservation: 'Start Observation Session',
      startObservationDescription: 'Begin recording a live behavioral observation',
      analyzeSessions: 'Analyze Past Sessions',
      analyzeSessionsDescription: 'Review and interpret recorded session data',
    },
  },
  behaviorSchemaList: {
    title: 'Behavior Schemas',
  },
  behaviorSchema: {
    title: 'New Behavior Schema',
    description: 'Define the behaviors you want to observe and record.',
    naming: {
      heading: 'Name your schema',
      placeholder: 'e.g. Blackbird in Oak Tree',
      submit: 'Create schema',
    },
    editor: {
      eventsHeading: 'Behaviors',
      addEventPlaceholder: 'Behavior name',
      addEventButton: 'Add',
      eventLimitReached: 'Maximum of {{max}} behaviors reached',
      tagsHeading: 'Tags',
      addTagPlaceholder: 'Tag name',
      addTagButton: 'Add',
      save: 'Save',
      saved: 'Saved',
      unsavedChanges: 'Unsaved changes',
      rerollColor: 'New color',
      moveUp: 'Move up',
      moveDown: 'Move down',
      removeEvent: 'Remove behavior',
      removeTag: 'Remove tag',
    },
  },
  observation: {
    title: 'Observation Session',
    description: 'Record behaviors as they occur in real time.',
  },
  analysis: {
    title: 'Analyze Past Sessions',
    description: 'Browse, filter, and interpret previously recorded sessions.',
  },
  common: {
    back: 'Back',
  },
} as const;

export default en;
