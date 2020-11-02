import { innerOffsetToOuterLocation } from "./innerOffsetToOuterLocation";
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

  const position = match && parseInt(match[2], 10);
  if (!position) {
    return { location, message };
  }

  return {
    location: innerOffsetToOuterLocation(position, json, locationInDocument),
    message: message,
  };
}
