import { DateTime } from "luxon";

const timestampToRelativeTime = (timestamp: number): string | null =>
  DateTime.fromMillis(timestamp).toRelative();

export {
  timestampToRelativeTime,
};
