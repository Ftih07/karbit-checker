import { Timestamp } from "firebase/firestore";

export interface Report {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  images: string[];
  createdAt: Timestamp | null;
  read?: boolean; // optional
}
