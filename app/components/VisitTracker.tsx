"use client";

import { useEffect } from "react";
import { trackVisit } from "@/lib/trackVisit";

export default function VisitTracker() {
  useEffect(() => {
    trackVisit();
  }, []);

  return null; // gak perlu render apa pun
}
