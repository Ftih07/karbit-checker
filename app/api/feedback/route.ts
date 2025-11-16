import nodemailer from "nodemailer";

import { NextResponse } from "next/server";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = String(form.get("name"));
    const email = String(form.get("email"));
    const phone = String(form.get("phone"));
    const message = String(form.get("message"));
    const images = form.getAll("images") as File[];

    // ========== UPLOAD CLOUDINARY ==========
    const cloudinaryUrls: string[] = [];

    for (const img of images) {
      const fd = new FormData();
      fd.append("file", img);
      fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

      const upload = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
        method: "POST",
        body: fd,
      });

      const result = await upload.json();
      cloudinaryUrls.push(result.secure_url);
    }

    // ========== SAVE TO FIRESTORE ==========
    await addDoc(collection(db, "feedback_reports"), {
      name,
      email,
      phone,
      message,
      images: cloudinaryUrls,
      createdAt: serverTimestamp(),
    });

    // ========== SETUP NODEMAILER TRANSPORT ==========
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail kamu
        pass: process.env.EMAIL_PASS, // App Password Gmail
      },
    });

    // ========== EMAIL TO ADMIN ==========
    await transporter.sendMail({
      from: `"Karbit System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL!,
      subject: "🔔 Laporan Baru dari Website Karbit Checker",
      html: `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Laporan Baru</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #eef2ff 0%, #faf5ff 50%, #fdf2f8 100%); padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1);">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
              Karbit Checker
            </h1>
            <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px; font-weight: 500;">
              Sistem Pelaporan Website
            </p>
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <div style="background: linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #6366f1;">
              <h2 style="margin: 0 0 20px 0; color: #1e1b4b; font-size: 22px; font-weight: 700;">
                📋 Laporan Baru Masuk
              </h2>
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                Anda menerima laporan/masukan baru dari pengguna website Karbit Checker
              </p>
            </div>
            
            <!-- User Info -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width: 100px;">
                        <span style="color: #6366f1; font-weight: 600; font-size: 14px;">👤 Nama</span>
                      </td>
                      <td>
                        <span style="color: #1e293b; font-size: 14px; font-weight: 500;">${name}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width: 100px;">
                        <span style="color: #6366f1; font-weight: 600; font-size: 14px;">✉️ Email</span>
                      </td>
                      <td>
                        <a href="mailto:${email}" style="color: #6366f1; font-size: 14px; text-decoration: none; font-weight: 500;">${email}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width: 100px;">
                        <span style="color: #6366f1; font-weight: 600; font-size: 14px;">📱 Telepon</span>
                      </td>
                      <td>
                        <span style="color: #1e293b; font-size: 14px; font-weight: 500;">${phone}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- Message -->
            <div style="margin: 24px 0;">
              <h3 style="margin: 0 0 12px 0; color: #6366f1; font-size: 16px; font-weight: 600;">
                💬 Pesan
              </h3>
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; border-left: 3px solid #a855f7;">
                <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <!-- Images -->
            ${
              cloudinaryUrls.length > 0
                ? `
            <div style="margin-top: 24px;">
              <h3 style="margin: 0 0 12px 0; color: #6366f1; font-size: 16px; font-weight: 600;">
                🖼️ Lampiran Gambar
              </h3>
              <div style="display: block;">
                ${cloudinaryUrls
                  .map(
                    (url) => `
                  <div style="margin-bottom: 12px; border-radius: 8px; overflow: hidden; border: 2px solid #e2e8f0;">
                    <img src="${url}" alt="Lampiran" style="width: 100%; max-width: 100%; height: auto; display: block;" />
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
            `
                : `
            <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; border-left: 3px solid #f59e0b; margin-top: 24px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                ⚠️ Tidak ada gambar dilampirkan
              </p>
            </div>
            `
            }
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">
              Email ini dikirim secara otomatis dari sistem Karbit Checker
            </p>
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
              © ${new Date().getFullYear()} Karbit Checker. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
    });

    // ========== EMAIL TO USER (THANK YOU) ==========
    await transporter.sendMail({
      from: `"Karbit Checker" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Terima Kasih atas Laporannya!",
      html: `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Terima Kasih</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #eef2ff 0%, #faf5ff 50%, #fdf2f8 100%); padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1);">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
              Karbit Checker
            </h1>
            <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px; font-weight: 500;">
              Terima Kasih!
            </p>
          </td>
        </tr>
        
        <!-- Success Icon -->
        <tr>
          <td style="padding: 40px 30px 20px 30px; text-align: center;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; margin: 0 auto 24px auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);">
              <span style="font-size: 48px; line-height: 1;">✓</span>
            </div>
            <h2 style="margin: 0 0 12px 0; color: #1e1b4b; font-size: 24px; font-weight: 700;">
              Laporan Berhasil Dikirim!
            </h2>
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 0 30px 40px 30px;">
            <div style="background: linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <p style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; line-height: 1.6;">
                Halo <strong style="color: #6366f1;">${name}</strong>,
              </p>
              <p style="margin: 0 0 16px 0; color: #475569; font-size: 15px; line-height: 1.6;">
                Terima kasih sudah meluangkan waktu untuk mengirim laporan/masukan kepada kami. Kontribusi Anda sangat berarti untuk pengembangan website <strong>Karbit Checker</strong>.
              </p>
              <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.6;">
                Tim kami akan segera meninjau laporan yang Anda kirimkan dan akan menindaklanjutinya dengan sebaik-baiknya.
              </p>
            </div>
            
            <!-- Info Box -->
            <div style="background-color: #dbeafe; border-radius: 8px; padding: 16px; border-left: 4px solid #3b82f6; margin-bottom: 24px;">
              <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                💡 <strong>Info:</strong> Jika laporan Anda memerlukan tindak lanjut, kami akan menghubungi Anda melalui email atau nomor telepon yang Anda berikan.
              </p>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0 24px 0;">
              <a href="https://karbit.yvezh.my.id/" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                🏠 Kembali ke Website
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #1e293b; font-size: 15px; font-weight: 600;">
                Salam hangat,
              </p>
              <p style="margin: 0; color: #6366f1; font-size: 16px; font-weight: 700;">
                Tim Pengembang Karbit Checker
              </p>
            </div>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">
              Email ini dikirim secara otomatis dari sistem Karbit Checker
            </p>
            <p style="margin: 0 0 12px 0; color: #94a3b8; font-size: 12px;">
              © ${new Date().getFullYear()} Karbit Checker. All rights reserved.
            </p>
            <p style="margin: 0; color: #cbd5e1; font-size: 11px;">
              Jika Anda tidak merasa mengirim laporan, abaikan email ini.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
    });

    return NextResponse.json({ ok: true, message: "Berhasil dikirim" });
  } catch (err) {
    console.error("ERROR FEEDBACK:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
