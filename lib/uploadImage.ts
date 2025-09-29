// lib/uploadImage.ts
import { CLOUDINARY_API_URL, CLOUDINARY_UPLOAD_PRESET } from "./cloudinary";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_API_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload gagal");
  return res.json(); // hasilnya ada secure_url
}
