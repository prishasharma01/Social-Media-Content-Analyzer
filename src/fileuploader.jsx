import { useRef } from "react";

export default function FileUploader({ onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-pink-400 rounded-xl bg-pink-50 text-center p-6 cursor-pointer hover:bg-pink-100 transition"
      onClick={() => fileInputRef.current.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept=".txt,.pdf,.docx"
      />

      <p className="text-lg text-pink-600 font-semibold">
        📄 Click or Drag & Drop your file here
      </p>
      <p className="text-sm text-gray-500 mt-2">or</p>

      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent triggering drag-drop click
          fileInputRef.current.click();
        }}
        className="mt-3 px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
      >
        Choose File
      </button>
    </div>
  );
}
