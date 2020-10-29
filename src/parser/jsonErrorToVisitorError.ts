import { Location, VisitorError } from "./makeCstVisitor";

// Convert a JSON.parse() error to visitor error. Updates the error location to
// document space and cleans up the message, if possible.
export function jsonErrorToVisitorError(
  error: Error,
  json: string,
  locationInDocument: Location // The location of the start of the json that caused the error
): VisitorError {
  const location = locationInDocument;

  // Try to convert to a more helpful diagnostic
  const match = /^(.*) at position ([0-9]+)$/.exec(error.message);
  const message = match
    ? match[1]
    : error.message ?? "Unknown issue parsing attribute JSON";

  let position = match && parseInt(match[2], 10);
  if (!position) {
    return { location, message };
  }

  // Offset is easy to calculate...
  location.offset += position;

  // ...but line and column get trickier. Calculate actual position of
  // the error in the overall document by looking at line lengths
  const re = /(\r\n|\r|\n)/g; // account for weird newlines

  // Scan through the JSON string from line to line and adjust the error
  // location according to the offset
  for (
    let result = re.exec(json), lastIndex = 0;
    result && position > 0;
    result = re.exec(json)
  ) {
    const lineLength = result.index - lastIndex;
    lastIndex = result.index;
    if (position >= lineLength) {
      // Consume part of the position value and roll over to the next line.
      location.column = 1;
      ++location.line;
      position -= lineLength;
      continue;
    }

    // Consume the remainder of the position.
    location.column += position - 1;
  }
  return {
    location,
    message,
  };
}
