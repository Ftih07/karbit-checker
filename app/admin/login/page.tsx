"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Throttle states
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockEndTime, setLockEndTime] = useState<number | null>(null);

  // 🔍 Cek user sudah login → redirect ke dashboard admin
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().role === "admin") {
            router.push("/admin/dashboard");
          } else {
            await auth.signOut();
          }
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // 🕒 Cek apakah user masih terkunci (dari localStorage)
  useEffect(() => {
    const savedLockTime = localStorage.getItem("adminLoginLockTime");
    if (savedLockTime) {
      const time = parseInt(savedLockTime, 10);
      if (Date.now() < time) {
        setIsLocked(true);
        setLockEndTime(time);
      } else {
        localStorage.removeItem("adminLoginLockTime");
      }
    }
  }, []);

  // 🔁 Timer untuk auto unlock
  useEffect(() => {
    if (isLocked && lockEndTime) {
      const interval = setInterval(() => {
        if (Date.now() >= lockEndTime) {
          setIsLocked(false);
          setAttempts(0);
          setLockEndTime(null);
          localStorage.removeItem("adminLoginLockTime");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLocked, lockEndTime]);

  // 🔐 Handle Login dengan proteksi brute force
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLocked) {
      const remaining = Math.ceil((lockEndTime! - Date.now()) / 1000);
      setError(
        `Terlalu banyak percobaan gagal. Coba lagi dalam ${remaining} detik.`
      );
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().role === "admin") {
        router.push("/admin/dashboard");
      } else {
        setError("Anda bukan admin.");
        await auth.signOut();
      }

      // Reset counter kalau berhasil login
      setAttempts(0);
    } catch (err: unknown) {
      setAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5) {
          // 🚫 Kunci selama 30 detik
          const lockTime = Date.now() + 30 * 1000;
          localStorage.setItem("adminLoginLockTime", lockTime.toString());
          setIsLocked(true);
          setLockEndTime(lockTime);
          setError("Terlalu banyak percobaan gagal. Mohon tunggu 30 detik.");
        } else {
          setError(`Login gagal (${newAttempts}/5 percobaan).`);
        }
        return newAttempts;
      });

      if (
        err instanceof Error &&
        !err.message.includes("auth/invalid-credential")
      ) {
        console.error(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
            Memuat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
          {/* Header with Shield Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Admin Panel 🔐
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Area terbatas untuk administrator
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Lock Warning */}
            {isLocked && lockEndTime && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Akun terkunci. Tunggu{" "}
                  {Math.ceil((lockEndTime - Date.now()) / 1000)} detik.
                </span>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Admin
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLocked}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Masukkan password admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLocked}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
            >
              {isLocked ? "🔒 Terkunci..." : "Masuk sebagai Admin"}
            </button>

            {/* Attempts Counter */}
            {attempts > 0 && !isLocked && (
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Percobaan:{" "}
                  <span className="font-semibold text-red-500">
                    {attempts}/5
                  </span>
                </p>
              </div>
            )}
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
              <svg
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                Area ini dilindungi dengan sistem anti brute-force. Setelah 5
                kali percobaan gagal, akun akan terkunci selama 30 detik.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <footer className="mt-10 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
              <a
                href="/terms"
                className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 
                 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100 
                 dark:hover:bg-gray-800 transition"
              >
                Terms & Services
              </a>
              <a
                href="/privacy"
                className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700
                 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-100
                 dark:hover:bg-gray-800 transition"
              >
                Privacy Policy
              </a>
            </div>

            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
              Made with 💜 by Ftih07
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
