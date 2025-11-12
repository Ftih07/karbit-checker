"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

type Option = {
  label: string;
  score: number;
};

type Props = {
  question: string;
  options: Option[];
  onAnswer: (score: number) => void;
};

export default function QuestionCard({ question, options, onAnswer }: Props) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState<number | null>(null);

  const handleClick = (idx: number) => {
    const selectedScore = options[idx].score;
    setSelectedOption(idx);
    setTimeout(() => {
      onAnswer(selectedScore); // kirim skor ke parent
      setSelectedOption(null);
    }, 200);
  };

  const emojis = ["🎯", "⚡", "🔥", "✨", "💫", "🌟"];

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur-lg opacity-20 dark:opacity-30 animate-pulse"></div>

      {/* Card */}
      <div className="relative bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-6 md:p-8 w-full backdrop-blur-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        {/* Decorative Icon */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Pertanyaan
            </div>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 leading-relaxed transition-colors duration-300">
          {question}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              onMouseEnter={() => setIsHovering(idx)}
              onMouseLeave={() => setIsHovering(null)}
              className={`
                group relative w-full px-5 py-4 rounded-2xl font-medium text-left
                transition-all duration-200 ease-out
                ${
                  selectedOption === idx
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-95 shadow-lg"
                    : isHovering === idx
                    ? "bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 scale-105 shadow-md"
                    : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }
                border-2 border-transparent
                ${
                  isHovering === idx
                    ? "border-indigo-300 dark:border-indigo-600"
                    : ""
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="flex-1">{opt.label}</span>
                <span
                  className={`
                  text-xl transition-all duration-200
                  ${isHovering === idx ? "scale-110 rotate-12" : "scale-100"}
                  ${selectedOption === idx ? "animate-bounce" : ""}
                `}
                >
                  {emojis[idx % emojis.length]}
                </span>
              </div>

              {/* Hover effect indicator */}
              {isHovering === idx && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400/20 to-purple-400/20 dark:from-indigo-500/20 dark:to-purple-500/20 pointer-events-none"></div>
              )}
            </button>
          ))}
        </div>

        {/* Helper text */}
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          💡 Pilih jawaban yang paling cocok dengan kamu
        </p>
      </div>
    </div>
  );
}
