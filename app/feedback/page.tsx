"use client";

import { useState } from "react";

export default function FeedbackPage() {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    setLoading(true);

    const res = await fetch("/api/feedback", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.ok) {
      alert("Terima kasih! Laporanmu sudah terkirim.");
      formElement.reset();
      setSelectedFiles([]);
    } else {
      alert("Gagal mengirim laporan.");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full mb-4 sm:mb-6 shadow-lg">
            <span className="text-3xl sm:text-4xl">📝</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Lapor Bug / Saran
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto px-4">
            Bantu kami tingkatkan Karbit Checker dengan melaporkan bug atau
            memberikan saran untuk pengembangan website
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Formulir Pelaporan
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base mt-1">
              Lengkapi informasi di bawah ini
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6"
          >
            {/* Nama */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                <span className="inline-flex items-center gap-2">
                  <span>👤</span>
                  <span>Nama Lengkap</span>
                  <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                placeholder="Masukkan nama lengkap Anda"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                <span className="inline-flex items-center gap-2">
                  <span>✉️</span>
                  <span>Alamat Email</span>
                  <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                placeholder="contoh@email.com"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                <span className="inline-flex items-center gap-2">
                  <span>📱</span>
                  <span>Nomor Telepon</span>
                  <span className="text-xs text-gray-500 font-normal">
                    (opsional)
                  </span>
                </span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                placeholder="08123456789"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                <span className="inline-flex items-center gap-2">
                  <span>💬</span>
                  <span>Pesan / Bug / Saran</span>
                  <span className="text-red-500">*</span>
                </span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none text-sm sm:text-base"
                placeholder="Jelaskan bug yang Anda temukan atau saran untuk pengembangan website..."
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 Tips: Berikan detail selengkap mungkin agar kami bisa
                membantu lebih baik
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label
                htmlFor="images"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                <span className="inline-flex items-center gap-2">
                  <span>🖼️</span>
                  <span>Lampiran Gambar</span>
                  <span className="text-xs text-gray-500 font-normal">
                    (opsional)
                  </span>
                </span>
              </label>
              <div className="relative">
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center w-full px-4 py-8 sm:py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl mb-3">📷</div>
                    <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Klik untuk upload gambar
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF hingga 10MB (bisa multiple)
                    </p>
                  </div>
                </label>
              </div>

              {/* Preview Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    File terpilih ({selectedFiles.length}):
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-lg">🖼️</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                        >
                          <span className="text-lg">❌</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Mengirim Laporan...</span>
                  </>
                ) : (
                  <>
                    <span>📨</span>
                    <span>Kirim Laporan</span>
                  </>
                )}
              </button>
            </div>

            {/* Info Footer */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mt-4">
              <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                <span className="font-semibold">ℹ️ Informasi:</span> Data Anda
                akan kami jaga kerahasiaannya. Kami akan menghubungi Anda
                melalui email atau telepon jika diperlukan tindak lanjut.
              </p>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Butuh bantuan? Hubungi kami di{" "}
            <a
              href="mailto:support@karbit.com"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              support@karbit.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
