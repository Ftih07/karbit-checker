/*
 * File: app/terms/page.tsx
 * Simpan file ini di sini untuk membuat halaman di:
 * https://[domain-kamu]/terms
 */

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-100 dark:border-purple-900/30 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-3">
              Syarat dan Ketentuan
            </h1>
            <p className="text-indigo-100 text-center text-lg">
              Terms of Service - Karbit Checker
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
                  ! Syarat dan Ketentuan ("Syarat") ini mengatur akses Anda ke
                  dan penggunaan situs web dan layanan kami. Dengan mengakses
                  atau menggunakan Layanan, Anda setuju untuk terikat oleh
                  Syarat ini.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6 border-l-4 border-indigo-600 dark:border-indigo-400">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-bold">
                      1
                    </span>
                    Penggunaan Layanan
                  </h2>
                  <p className="leading-relaxed">
                    Anda setuju untuk menggunakan Layanan kami hanya untuk
                    tujuan yang sah dan sesuai dengan Syarat ini. Anda
                    bertanggung jawab atas semua aktivitas yang terjadi di bawah
                    akun Anda.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 border-l-4 border-purple-600 dark:border-purple-400">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 dark:bg-purple-500 text-white text-sm font-bold">
                      2
                    </span>
                    Akun Pengguna
                  </h2>
                  <p className="mb-4 leading-relaxed">
                    Untuk mengakses sebagian besar fitur, Anda harus mendaftar
                    akun. Anda dapat mendaftar menggunakan email atau melalui
                    layanan pihak ketiga (login sosial). Anda setuju untuk:
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
                        Memberikan informasi yang akurat, terkini, dan lengkap
                        selama proses pendaftaran.
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
                        Menjaga keamanan kata sandi Anda dan tidak
                        mengungkapkannya kepada pihak lain.
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
                        Segera memberi tahu kami jika Anda mengetahui adanya
                        pelanggaran keamanan atau penggunaan akun Anda secara
                        tidak sah.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-indigo-50 dark:from-pink-950/30 dark:to-indigo-950/30 rounded-xl p-6 border-l-4 border-pink-600 dark:border-pink-400">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-600 dark:bg-pink-500 text-white text-sm font-bold">
                      3
                    </span>
                    Penghentian Akun
                  </h2>
                  <p className="leading-relaxed">
                    Kami dapat menangguhkan atau menghentikan akun Anda kapan
                    saja dengan alasan apa pun, termasuk jika Anda melanggar
                    Syarat ini, tanpa pemberitahuan sebelumnya.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6 border-l-4 border-indigo-600 dark:border-indigo-400">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-bold">
                      4
                    </span>
                    Batasan Tanggung Jawab
                  </h2>
                  <div className="space-y-4">
                    <p className="leading-relaxed">
                      Layanan ini disediakan "SEBAGAIMANA ADANYA" tanpa jaminan
                      apa pun.
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {" "}
                        Karbit Checker
                      </span>{" "}
                      (karena ini proyek uji coba) tidak bertanggung jawab atas
                      segala kerusakan tidak langsung, insidental, atau
                      konsekuensial yang timbul dari penggunaan atau
                      ketidakmampuan Anda untuk menggunakan layanan ini.
                    </p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex gap-3">
                        <svg
                          className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <strong>Catatan:</strong> Ini adalah proyek uji coba
                          dan layanan disediakan tanpa jaminan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 border-l-4 border-purple-600 dark:border-purple-400">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 dark:bg-purple-500 text-white text-sm font-bold">
                      5
                    </span>
                    Perubahan pada Syarat Ini
                  </h2>
                  <p className="leading-relaxed">
                    Kami berhak untuk mengubah Syarat ini kapan saja. Jika kami
                    melakukan perubahan, kami akan memposting Syarat yang telah
                    direvisi di halaman ini. Dengan terus menggunakan Layanan
                    setelah perubahan tersebut, Anda setuju untuk terikat oleh
                    Syarat yang telah direvisi.
                  </p>
                </div>
              </div>

              {/* Agreement Notice */}
              <div className="mt-8 p-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border-2 border-indigo-300 dark:border-indigo-700">
                <div className="flex gap-4">
                  <svg
                    className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      Penting untuk Diketahui
                    </h3>
                    <p className="text-sm leading-relaxed">
                      Dengan menggunakan layanan Karbit Checker, Anda menyetujui
                      seluruh syarat dan ketentuan yang tercantum di halaman
                      ini. Jika Anda tidak setuju dengan syarat ini, mohon untuk
                      tidak menggunakan layanan kami.
                    </p>
                  </div>
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
