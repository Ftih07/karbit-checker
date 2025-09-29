"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResultPage() {
  const params = useSearchParams();
  const score = Number(params.get("score")) || 0;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">Hasil Karbit 🔥</h1>
      <p className="text-lg text-gray-700 mb-6">Total skor kamu: <span className="font-semibold">{score}</span></p>
      <p className="mb-8 text-gray-600">
        {score < 50
          ? "Masih cupu, karbitnya dikit 🐣"
          : score < 80
          ? "Lumayan karbit 🔥"
          : "Full karbit mode! 🚀"}
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-md hover:bg-indigo-700 transition"
      >
        Coba Lagi
      </Link>
    </main>
  );
}
