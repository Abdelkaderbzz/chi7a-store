"use client";

import { useRef, useState } from "react";
import { uploadImageAction } from "@/lib/actions";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface MultiImageUploadProps {
  name?: string;
  defaultImages?: string[];
  label?: string;
  maxImages?: number;
}

export function MultiImageUpload({
  name = "images",
  defaultImages = [],
  label = "صور المنتج (حد أقصى 5)",
  maxImages = 5,
}: MultiImageUploadProps) {
  const [urls, setUrls] = useState<string[]>(defaultImages);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (urls.length + files.length > maxImages) {
      toast.error(`يمكنك رفع ${maxImages} صور كحد أقصى.`);
      return;
    }

    setUploading(true);

    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImageAction(formData);
      if (result?.url) {
        newUrls.push(result.url);
      } else {
        toast.error("فشل رفع إحدى الصور.");
      }
    }

    setUrls((prev) => [...prev, ...newUrls]);
    setUploading(false);
    
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removeImage(indexToRemove: number) {
    setUrls(urls.filter((_, index) => index !== indexToRemove));
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />

      {urls.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {urls.map((url, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
              <Image src={url} alt={`Preview ${idx + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 transition-colors"
                title="حذف الصورة"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {urls.length < maxImages && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:border-gold hover:text-gold-dark disabled:opacity-50 transition-colors"
          >
            <Upload size={18} />
            {uploading ? "جاري الرفع..." : `اضغط لرفع صور إضافية (${urls.length}/${maxImages})`}
          </button>
          <input 
            ref={inputRef} 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleUpload} 
            className="hidden" 
          />
        </div>
      )}
    </div>
  );
}
