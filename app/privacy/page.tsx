/*
 * File: app/privacy/page.tsx
 * Simpan file ini di sini untuk membuat halaman di:
 * https://[domain-kamu]/privacy
 */

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-100 dark:border-purple-900/30 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-3">
              Kebijakan Privasi
            </h1>
            <p className="text-indigo-100 text-center text-lg">
              Privacy Policy - Karbit Checker
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-100 dark:border-purple-900/30 overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Terakhir diperbarui: 15 November 2025
              </p>
            </div>

            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              <div className="prose-content">
                <p className="text-lg leading-relaxed">
                  Selamat datang di{" "}
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    Karbit Checker
                  </span>
                  ! Kami menghargai privasi Anda dan berkomitmen untuk
                  melindunginya. Kebijakan Privasi ini menjelaskan bagaimana
                  kami mengumpulkan, menggunakan, dan membagikan informasi Anda
                  saat Anda menggunakan layanan kami.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6 border-l-4 border-indigo-600 dark:border-indigo-400">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-bold">
                      1
                    </span>
                    Informasi yang Kami Kumpulkan
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Kami mengumpulkan informasi yang Anda berikan secara
                    langsung saat Anda mendaftar:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <strong className="text-gray-900 dark:text-white">
                          Informasi Akun:
                        </strong>{" "}
                        Saat Anda membuat akun, kami mengumpulkan informasi
                        seperti nama, alamat email, dan username.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <strong className="text-gray-900 dark:text-white">
                          Login Pihak Ketiga (Social Login):
                        </strong>{" "}
                        Jika Anda memilih untuk mendaftar menggunakan layanan
                        pihak ketiga (seperti Google, GitHub, Facebook, atau
                        Twitter/X), kami akan menerima informasi profil Anda
                        dari layanan tersebut (seperti nama Anda, email, dan
                        foto profil) sesuai dengan otorisasi Anda.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 border-l-4 border-purple-600 dark:border-purple-400">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 dark:bg-purple-500 text-white text-sm font-bold">
                      2
                    </span>
                    Bagaimana Kami Menggunakan Informasi Anda
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Kami menggunakan informasi Anda untuk tujuan berikut:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Untuk menyediakan dan memelihara layanan kami.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Untuk mengelola akun Anda dan mengautentikasi login
                        Anda.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Untuk mempersonalisasi pengalaman Anda, seperti
                        menampilkan nama dan foto profil Anda.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Untuk berkomunikasi dengan Anda, termasuk mengirim
                        pemberitahuan terkait layanan.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-indigo-50 dark:from-pink-950/30 dark:to-indigo-950/30 rounded-xl p-6 border-l-4 border-pink-600 dark:border-pink-400">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-600 dark:bg-pink-500 text-white text-sm font-bold">
                      3
                    </span>
                    Pihak Ketiga dan Penyimpanan Data
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Kami menggunakan layanan pihak ketiga untuk membantu kami
                    beroperasi:
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <strong className="text-gray-900 dark:text-white">
                          Firebase (oleh Google):
                        </strong>{" "}
                        Kami menggunakan Firebase untuk layanan backend,
                        termasuk otentikasi (termasuk login sosial) dan database
                        (Firestore). Data Anda disimpan dengan aman di server
                        Firebase.
                      </div>
                    </li>
                  </ul>
                  <p className="leading-relaxed font-medium text-gray-900 dark:text-white">
                    Kami tidak menjual atau menyewakan informasi pribadi Anda
                    kepada pihak ketiga.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6 border-l-4 border-indigo-600 dark:border-indigo-400">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-bold">
                      4
                    </span>
                    Keamanan Data
                  </h2>
                  <p className="leading-relaxed">
                    Keamanan data Anda penting bagi kami. Kami menggunakan
                    langkah-langkah keamanan standar industri (disediakan oleh
                    Firebase) untuk melindungi data Anda dari akses,
                    pengungkapan, perubahan, atau penghancuran yang tidak sah.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 border-l-4 border-purple-600 dark:border-purple-400">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 dark:bg-purple-500 text-white text-sm font-bold">
                      5
                    </span>
                    Perubahan pada Kebijakan Ini
                  </h2>
                  <p className="leading-relaxed">
                    Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke
                    waktu. Kami akan memberi tahu Anda tentang perubahan apa pun
                    dengan memposting Kebijakan Privasi baru di halaman ini.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-indigo-50 dark:from-pink-950/30 dark:to-indigo-950/30 rounded-xl p-6 border-l-4 border-pink-600 dark:border-pink-400">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-600 dark:bg-pink-500 text-white text-sm font-bold">
                      6
                    </span>
                    Hubungi Kami
                  </h2>
                  <p className="leading-relaxed">
                    Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini,
                    silakan hubungi kami (Anda bisa menambahkan email kontak di
                    sini).
                  </p>
                </div>
              </div>
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
