import { Location } from "../bluehawk";

// Convenience function to transform an offset within an inner string
// (substring) that appears in the outer text at the given location.
export function innerOffsetToOuterLocation(
  innerOffset: number,
  innerText: string,
  innerTextOuterLocation: Location
): Location {
  const location = innerTextOuterLocation;
  // Offset is easy to calculate...
  location.offset += innerOffset;

  // ...but line and column get trickier. Calculate actual position of
  // the error in the overall document by looking at line lengths
  const re = /(\r\n|\r|\n)/g; // account for weird newlines

  // Scan through the JSON string from line to line and adjust the error
  // location according to the offset
  for (
    let result = re.exec(innerText), lastIndex = 0;
    result && innerOffset > 0;
    result = re.exec(innerText)
  ) {
    const lineLength = result.index - lastIndex;
    lastIndex = result.index;
    if (innerOffset >= lineLength) {
      // Consume part of the position value and roll over to the next line.
      location.column = 1;
      ++location.line;
      innerOffset -= lineLength;
      continue;
    }

    // Consume the remainder of the position.
    location.column += innerOffset - 1;
  }
  return location;
}

export function innerLocationToOuterLocation(
  innerLocation: Location,
  innerText: string,
  innerTextOuterLocation: Location
): Location {
  // TODO: This might be possible to do without iterating line by line over the
  // inner text
  return innerOffsetToOuterLocation(
    innerLocation.offset,
    innerText,
    innerTextOuterLocation
  );
}
