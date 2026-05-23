import React, { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";

export default function ImageUploader({ onChange }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handlePick = () => fileRef.current?.click();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onChange && onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const remove = () => {
    setPreview(null);
    onChange && onChange(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="image-uploader glass" style={{ padding: "1.5rem", textAlign: "center", borderRadius: 12, border: '1px dashed var(--gold)' }}>
      <input type="file" accept="image/*" ref={fileRef} hidden onChange={handleFile} />
      {preview ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img src={preview} alt="preview" style={{ maxWidth: "200px", borderRadius: "12px", objectFit: 'cover' }} />
          <button type="button" onClick={remove} className="btn-ghost" style={{ position: "absolute", top: "-0.5rem", right: "-0.5rem", background: 'var(--danger)', color: '#fff', borderRadius: '50%', padding: '0.2rem' }}>
            <X size={16} />
          </button>
        </div>
      ) : (
        <button type="button" onClick={handlePick} className="btn-gold" style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}>
          <UploadCloud size={18} />
          رفع صورة
        </button>
      )}
    </div>
  );
}
