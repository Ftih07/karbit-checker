// app/quiz/result/page.tsx
import { Suspense } from "react";
import ResultPageClient from "./ResultPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading…</div>}>
      <ResultPageClient />
    </Suspense>
  );
}
