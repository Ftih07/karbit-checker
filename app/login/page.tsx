"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  auth,
  db,
  googleProvider,
  facebookProvider,
  githubProvider,
  microsoftProvider,
  twitterProvider,
  yahooProvider,
} from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  AuthProvider,
  User,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // bisa username atau email
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockEndTime, setLockEndTime] = useState<number | null>(null);

  // =========================
  // 🟢 Check user login state
  // =========================
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        let userDoc = await getDoc(ref);

        // Buat user jika belum ada
        if (!userDoc.exists()) {
          await setDoc(ref, {
            email: user.email,
            role: "user",
            createdAt: new Date(),
          });

          userDoc = await getDoc(ref);
        }

        // Validasi role
        if (userDoc.exists() && userDoc.data().role === "user") {
          router.push("/dashboard");
        } else {
          await auth.signOut();
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // =========================
  // 🟡 Lock timer
  // =========================
  useEffect(() => {
    const savedLockTime = localStorage.getItem("loginLockTime");
    if (savedLockTime) {
      const time = parseInt(savedLockTime, 10);
      if (Date.now() < time) {
        setIsLocked(true);
        setLockEndTime(time);
      } else {
        localStorage.removeItem("loginLockTime");
      }
    }
  }, []);

  useEffect(() => {
    if (isLocked && lockEndTime) {
      const interval = setInterval(() => {
        if (Date.now() >= lockEndTime) {
          setIsLocked(false);
          setAttempts(0);
          setLockEndTime(null);
          localStorage.removeItem("loginLockTime");
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLocked, lockEndTime]);

  // =========================
  // 🟨 Login dengan username/email
  // =========================
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
      let emailToUse = identifier;

      // Kalau bukan email, cari dulu di Firestore
      if (!identifier.includes("@")) {
        const q = query(
          collection(db, "users"),
          where("username", "==", identifier)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          throw new Error("Username tidak ditemukan");
        }
        const userData = querySnapshot.docs[0].data();
        emailToUse = userData.email;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailToUse,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().role === "user") {
        router.push("/dashboard");
      } else {
        setError("Pengguna tidak valid");
        await auth.signOut();
      }

      setAttempts(0);
    } catch (err: unknown) {
      setAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5) {
          const lockTime = Date.now() + 30 * 1000;
          localStorage.setItem("loginLockTime", lockTime.toString());
          setIsLocked(true);
          setLockEndTime(lockTime);
          setError("Terlalu banyak percobaan gagal. Mohon tunggu 30 detik.");
        } else {
          setError(`Login gagal (${newAttempts}/5 percobaan).`);
        }
        return newAttempts;
      });

      if (err instanceof Error) console.error(err.message);
    }
  };

  // =========================
  // 🔹 Save user universal
  // =========================
  const saveUserIfNew = async (user: User) => {
    const ref = doc(db, "users", user.uid);
    const userDoc = await getDoc(ref);

    if (!userDoc.exists()) {
      const email = user.email || "";
      const displayName = user.displayName || "";
      const username = displayName
        ? displayName.toLowerCase().replace(/\s+/g, "")
        : email.split("@")[0];

      const avatar =
        user.photoURL ||
        "https://res.cloudinary.com/dl7v3mypy/image/upload/v1762862340/kon0gqprzzxdmwhnzqex.png";

      await setDoc(ref, {
        email,
        username,
        role: "user",
        avatar,
        createdAt: new Date(),
      });
    }
  };

  // =========================
  // 🔹 Social login handler universal
  // =========================
  const handleSocialSignIn = async (provider: AuthProvider) => {
    try {
      const res = await signInWithPopup(auth, provider);
      await saveUserIfNew(res.user);
      router.push("/dashboard");
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError("Terjadi kesalahan.");
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
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Selamat Datang! 🔥
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Masuk untuk melanjutkan petualanganmu
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email/Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email atau Username
              </label>
              <input
                type="text"
                placeholder="Masukkan email atau username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-12"
                required
              />

              {/* Tombol toggle show/hide */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-13 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLocked}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLocked ? "Terkunci..." : "Masuk"}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/70 dark:bg-gray-900/70 text-gray-500 dark:text-gray-400">
                  Atau masuk dengan
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={() => handleSocialSignIn(googleProvider)}
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 hover:shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Masuk dengan Google
            </button>

            {/* Facebook Sign In */}
            <button
              type="button"
              onClick={() => handleSocialSignIn(facebookProvider)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 hover:shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2V9.5c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12" />
              </svg>
              Masuk dengan Facebook
            </button>

            {/* GitHub Sign In */}
            <button
              type="button"
              onClick={() => handleSocialSignIn(githubProvider)}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 hover:shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.8 10.9c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.2-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.5-.3-5.1-1.3-5.1-5.7 0-1.2.4-2.1 1-2.9-.1-.3-.4-1.4.1-2.8 0 0 .8-.3 2.8 1 .8-.2 1.6-.3 2.4-.3s1.6.1 2.4.3c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.8.6.8 1 1.7 1 2.9 0 4.4-2.6 5.4-5.1 5.7.4.3.8 1 .8 2v3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
              </svg>
              Masuk dengan GitHub
            </button>

            {/* Microsoft Sign In */}
            <button
              type="button"
              onClick={() => handleSocialSignIn(microsoftProvider)}
              className="w-full bg-[#2F2F2F] hover:bg-black text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z" />
                <path fill="#7FBA00" d="M13 1h10v10H13z" />
                <path fill="#00A4EF" d="M1 13h10v10H1z" />
                <path fill="#FFB900" d="M13 13h10v10H13z" />
              </svg>
              Masuk dengan Microsoft
            </button>

            {/* Twitter (X) Sign In */}
            <button
              type="button"
              onClick={() => handleSocialSignIn(twitterProvider)}
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Masuk dengan X
            </button>

            {/* Yahoo Sign In */}
            <button
              type="button"
              onClick={() => handleSocialSignIn(yahooProvider)}
              className="w-full bg-[#6002de] hover:bg-[#4a01ad] text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1.12-6.023l-1.63 3.447-1.12-.533 1.63-3.447c-.573-.3-1.05-.7-1.42-1.18-.37-.48-.63-.98-.78-1.5-.15-.52-.22-1.04-.22-1.58 0-.6.1-1.16.3-1.68.2-.52.5-1 .88-1.4.38-.4.84-.72 1.36-1 .52-.28 1.1-.4 1.74-.4.6 0 1.16.12 1.68.38s.96.6 1.32 1c.36.4.63.88.8 1.4.17.52.26 1.08.26 1.68 0 .54-.07 1.06-.22 1.58-.15.52-.4 1.02-.76 1.5-.36.48-.82.88-1.38 1.18zm-1.09-2.22c.24.18.48.3.7.38.22.08.44.12.66.12.26 0 .5-.04.72-.12.22-.08.42-.2.6-.38.18-.18.33-.38.44-.62s.17-.5.17-.78c0-.3-.05-.58-.16-.84-.1-.26-.26-.5-.46-.72-.2-.2-.44-.38-.72-.5s-.6-.2-1-.2c-.36 0-.7.06-1 .2s-.58.3-.8.5c-.2.2-.38.44-.5.72s-.2.58-.2.84c0 .28.06.54.18.78s.26.44.46.62zm-3.08-6.14h-1.4l3.1 5.02v3.74h1.4v-3.74l3.1-5.02h-1.4l-2.4 3.86z" />
              </svg>
              Masuk dengan Yahoo
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold hover:underline transition-colors"
            >
              Daftar Sekarang
            </Link>
          </p>
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
