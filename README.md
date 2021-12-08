# RACECAR !

Welcome to RACECAR, a palindrome and slotcar racing game.

These instructions mostly serve as documentation for the code, since I only work on it intermittently, and have to spend so much time reviewing what I last did on it. So this is kind of like, "last time on RACECAR…"

## Classes

### Track

Creates a Track instance, which is used to build the track data and display the track UI. This iteration also adds cars to the track, and places them appropriately.

params:

  - `el` [DOM Element] Element in which to place the track UI.
  - `kind` [String] Enum available in `preset` object. The preset track shape.

methods:

  - `setKind`
    - Set the track kind.
    - @param `kind` [String] preset track shape (see `preset`). Will create a custom track if this string does not correlate to a preset.
    - @returns `kind`.
  - `buildTrack`
    - Uses a track string to create the Track UI.
    - @param `codeStr` [String] the cardinal-direction encoded string to create the track UI from.
    - @returns `true`.
  - `addCar`
    - Adds a car to the track and returns the car's ID.
    - @param `pos` [Array] an array of two numbers indicating the SVG position of the track segment to start the car on.
    - @returns [Integer] The Id of the car being added.

### Car

Creates a racecar instance, which stores positional data and places the car's avatar within the UI.

params:

  - `id` [Integer] The unique identifier for this car instance.
  - `pos` [Array] The starting position for this car, as the grid position (x, y) of the starting track segment.

methods:

  - `drive`
  	- Determines speed and velocity, and changes car position on next animation frame.
  	- @param `s` [Number] 0 - 1, inclusive. The requested speed for this animation frame.
  	- @returns [Number] Calculated speed.

static methods:
	- `set trackSeg`
	 - Records the track segment that the car is on, and the relative position in that segment.
	- `set position`
   - Sets the absolute position in the track SVG. This is the center point of the car element.
    - @param `x, y` [Array] The (x, y) position for this car.
    - @returns [Array] The updated position for this car.
	- `set speed`
		- Sets value for the car's speed, in `_s`.
		- @param `n` [Number] Absolute speed of the car.
		- @returns [Number] The updated speed.

 - `get speed`
		- Gets value for the car's speed.
		- @returns [Number] The car's current speed.

## Functions

### setAttrs

Bulk set attributes on a target element.

params:

  - `target` [DOM Element]
  - `attrs` [Object] Where the keys are the attributes and the values are, well, the attribute values.

### createSVG

Create SVG element in the proper namespace.

params:

  - `tag` [String] A valid SVG tag name.

returns:

  - New `SVG` element.

## Constants

### segType [Object]

SVG coordinates for all of the track segment types, coded by directionality (using cardinal map directions) as direction entering, leaving. ie, `sw` is southwest, meaning entering travelling down then exiting travelling left; `ws` is westsouth, meaning left then down.

### startPos [Object]

Starting posiitions for the racecars, dependent on the directionality of the first piece of track.

keys: 
  - `e` Eastward track starting point.
  - `s` Southward track starting point.

### preset [Object]

Track shape presets. These are strings that are parsed into pairs that correlate to enter/exit track directions. ie, `eees` splits to `ee` and `es`, so the car would travel rightward through the first segment, enter travelling right and exit travelling down through the second segment.

keys:
  - `oval` an oval-shaped track.
