# Observation engine

The observation engine is the most critical piece of Ethoscope. It translates the user defined behavior schema into a purpose built tracking tool, prioritizing simple touch controls and minimal, intuitive interaction.

The core experience is built around a timebound session with a start and end timestamp. Each behavior is cataloged with a timestamp and eventually (OOS for first pass) a geolocation. These can be used to reconstruct a detailed timeline of a particular session.

## State

The state for an observation session is simple: 
- id of the selected behavior schema
- start time stamp
- list of observations

## Layout

The observational engine aims to provide touch ready controls that are easy to use

in general it should take the form of a grid and adjust fluidly depending on the number of behaviors in the schema

there is a sticky bottom bar with these features:

left - end session, longpress to complete (add longpress component 5s)
middle - session duration timer tracking 1s intervals since session start
right - undo last tracked observation (longpress 2s)

### Behavior tracking view

1 behavior => one large central 'button'
2 behaviors => two stacked large buttons
3 behaviors => three stacked large buttons
4 behaviors => two column / two row grid
5 behaviors => two column / two row grid with a third final row spanning both columns
6 behaviors => 2 column / 3 row grid

### tagging view

for behaviors with sub tags, selecting a behavior opens the tagging view. this will always be a list of spanning buttons and a final spanning button to cancel. 

the buttons in every case are colored via the color of the behavior or tag.

## Tracking behavior

for behaviors with NO tags, tapping the button gives 'increment' functionality

for behaviors with tags, open the tag tracking modal

in general each button has a bit of state on the right showing total tracked observations. tag tracking is not reflected in the main behavior view. when you tap a taggable behavior and open the tagging view, tracked observations ARE visible there on the tag buttons.

## Ending a session

this saves it's data to local storage. for now let's add a simple debug view in analysis that lets you open any past session and see it's json record. we'll go into more depth there later