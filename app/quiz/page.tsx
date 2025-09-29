"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";
import QuestionCard from "../components/QuestionCard";
import { Trophy, ChevronRight } from "lucide-react";

const questions = [
  {
    id: 1,
    text: "seberapa suka kamu dengan Kaoruko Waguri?",
    options: ["Suka bgt", "My Kisah", "My bini"],
  },
  {
    id: 2,
    text: "INGAT Darah keturunan karbit akan mengalir pada anak cucunya!",
    options: ["Yaya saya setuju", "bawakdahelwak", "womp womp"],
  },
  {
    id: 3,
    text: "Berapa jumlah Waifu/husbumu sekarang?",
    options: ["1", "3", "Infinity"],
  },
  {
    id: 4,
    text: "Siapa seiyuu (pengisi suara) dari karakter favoritmu?",
    options: [
      "Gak tau, yg penting cakep/keren",
      "Langsung cek Gugel",
      "Hafal sampe tanggal lahirnya",
    ],
  },
  {
    id: 5,
    text: "Deadline tugas numpuk VS Episode baru rilis. Pilih mana?",
    options: [
      "Jelas tugas lah, masa depan nih",
      "Nonton dulu bentar, abis itu nugas (tapi ketiduran)",
      "Waifu/Husbu adalah masa depanku",
    ],
  },
];

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = () => {
    setIsAnimating(true);
    const randomPoint = Math.floor(Math.random() * 21) + 10; // 10-30

    setTimeout(() => {
      setScore(score + randomPoint);
      setStep(step + 1);
      setIsAnimating(false);
    }, 300);
  };

  if (step >= questions.length) {
    return (
      <main className="relative flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 transition-colors duration-300">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 dark:bg-green-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Success Icon */}
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
            Quiz selesai! Yuk lihat hasilnya
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

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div
        className={`relative z-10 w-full max-w-2xl transition-all duration-300 ${
          isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"
        }`}
      >
        <QuestionCard
          question={questions[step].text}
          options={questions[step].options}
          onAnswer={handleAnswer}
        />

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Pertanyaan {step + 1} dari {questions.length}
          </p>

          {/* Progress Bar */}
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
