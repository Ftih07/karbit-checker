"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";
import QuestionCard from "../components/QuestionCard";
import { Trophy, ChevronRight } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Option {
  label: string;
  score: number;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 Ambil pertanyaan dari Firestore (5 random)
  useEffect(() => {
    const fetchQuestions = async () => {
      const snapshot = await getDocs(collection(db, "questions"));
      const allQuestions = snapshot.docs.map(
        (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Question)
      );

      // Acak urutan pertanyaan
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      // Ambil 5 teratas
      const selected = shuffled.slice(0, 5);
      setQuestions(selected);
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  // 🧮 Ketika user jawab
  const handleAnswer = (selectedScore: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setScore((prev) => prev + selectedScore);
      setStep((prev) => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  // ⏳ Loading state dulu
  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg animate-pulse">Loading questions...</p>
      </main>
    );
  }

  // 🎯 Kalau semua pertanyaan sudah dijawab
  if (step >= questions.length) {
    return (
      <main className="relative flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 transition-colors duration-300">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 dark:bg-green-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 p-6 rounded-full">
                <Trophy className="w-16 h-16 text-white animate-bounce" />
              </div>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Mantap! 🎉
          </h2>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Quiz selesai! Skor total kamu: <b>{score}</b>
          </p>

          <Link
            href={{
              pathname: "/quiz/result",
              query: { score },
            }}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Lihat Hasil
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
    );
  }

  // 🧩 Tampilan pertanyaan
  const current = questions[step];

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 transition-colors duration-300">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div
        className={`relative z-10 w-full max-w-2xl transition-all duration-300 ${
          isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"
        }`}
      >
        <QuestionCard
          question={current.text}
          options={current.options}
          onAnswer={(score) => handleAnswer(score)} // ✅ langsung kirim score
        />

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Pertanyaan {step + 1} dari {questions.length}
          </p>

          <div className="w-full max-w-xs mx-auto h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </main>
  );
}
