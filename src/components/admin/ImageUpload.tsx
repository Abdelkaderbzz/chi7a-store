"use client";

import { useRef, useState } from "react";
import { uploadImageAction } from "@/lib/actions";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  name?: string;
  defaultValue?: string;
  label?: string;
}

export function ImageUpload({ name = "image", defaultValue = "", label = "الصورة" }: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadImageAction(formData);
    if (result?.url) setUrl(result.url);
    setUploading(false);
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 mb-2">
          <Image src={url} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <Upload size={16} />
          {uploading ? "جاري الرفع..." : "رفع صورة"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="أو أدخل رابط الصورة"
        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
      />
    </div>
  );
}
