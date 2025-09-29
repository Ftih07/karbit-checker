"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";
import { Trophy, Medal, Award, ArrowLeft, Crown, Sparkles, Zap } from "lucide-react";

interface Leader {
  name: string;
  score: number;
  avatar: string;
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "leaderboard"), orderBy("score", "desc"));
        const snap = await getDocs(q);
        setLeaders(snap.docs.map((doc) => doc.data() as Leader));
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 2:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const getCardStyle = (index: number) => {
    switch (index) {
      case 0:
        return "border-2 border-yellow-400 dark:border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 scale-105 shadow-xl";
      case 1:
        return "border-2 border-gray-300 dark:border-gray-600 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 shadow-lg";
      case 2:
        return "border-2 border-orange-300 dark:border-orange-600 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 shadow-lg";
      default:
        return "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md";
    }
  };

  return (
    <main className="relative min-h-screen px-4 py-12 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-yellow-950 dark:to-orange-950 transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300 dark:bg-orange-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-300 dark:bg-red-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-600 dark:to-orange-700 p-6 rounded-full">
                <Trophy className="w-16 h-16 text-white animate-bounce" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 dark:from-yellow-400 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent">
            Leaderboard Karbit 🔥
          </h1>
          
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Top Players dengan Skor Tertinggi!
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border border-gray-200 dark:border-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </Link>
        </div>

        {/* Leaderboard Card */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-yellow-600 dark:border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Belum ada data leaderboard
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                Jadilah yang pertama! 🚀
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaders.map((user, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${getCardStyle(index)}`}
                >
                  {/* Rank Badge */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg ${getRankBadge(index)} shadow-md`}>
                    {index < 3 ? getMedalIcon(index) : index + 1}
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className={`w-14 h-14 rounded-full object-cover ${
                        index === 0 
                          ? "border-4 border-yellow-400 dark:border-yellow-500 shadow-lg" 
                          : "border-2 border-gray-200 dark:border-gray-600"
                      }`}
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg text-gray-800 dark:text-gray-100 truncate">
                      {user.name}
                      {index === 0 && <span className="ml-2">👑</span>}
                      {index === 1 && <span className="ml-2">🥈</span>}
                      {index === 2 && <span className="ml-2">🥉</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        Skor: {user.score}
                      </p>
                    </div>
                  </div>

                  {/* Score Display (large screens) */}
                  <div className="hidden md:flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                    <span className={`text-2xl font-bold ${
                      index === 0 
                        ? "bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent" 
                        : "text-gray-700 dark:text-gray-300"
                    }`}>
                      {user.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        {!loading && leaders.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-500 dark:to-orange-500 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <Zap className="w-5 h-5" />
              Coba Tes Sekarang!
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}