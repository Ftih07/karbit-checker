"use client";

import Link from "next/link";
import { Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Zap className="w-16 h-16 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <Sparkles className="w-8 h-8 text-yellow-500 dark:text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient">
          Tes Karbit 🔥
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300 max-w-md mx-auto">
          Seberapa karbit kamu? Yuk cek sekarang dan temukan kepribadian aslimu!
        </p>

        {/* CTA Button */}
        <Link
          href="/quiz"
          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600"
        >
          Mulai Tes
          <Zap className="w-5 h-5 group-hover:animate-bounce" />
        </Link>

        {/* Additional Info */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          ⚡ Cuma 2 menit • 💯 Gratis • 🎯 Akurat
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">  
          Made with 💜 by Ftih07
        </p>
      </div>
    </main>
  );
}