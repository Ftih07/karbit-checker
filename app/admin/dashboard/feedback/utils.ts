import { Timestamp } from "firebase/firestore";

export function formatDate(timestamp?: Timestamp | null) {
  if (!timestamp) return "-";
  const date = timestamp.toDate();
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
