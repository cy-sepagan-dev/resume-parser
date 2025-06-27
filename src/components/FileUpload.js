import React, { useState } from "react";

const FileUpload = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const uploaded = e.target.files[0];
    if (!uploaded) return;

    setFile(uploaded);
    onFileSelect(uploaded); // Pass the file to parent
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-400 rounded-xl bg-white w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-gray-700">Upload Resume (PDF/Image)</h2>

      <input
        type="file"
        accept=".pdf,image/*"
        onChange={handleChange}
        className="block w-full text-sm text-gray-600
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-100 file:text-blue-700
                   hover:file:bg-blue-200"
      />

      {file && (
        <div className="text-sm text-gray-600 text-center">
          <p><strong>File:</strong> {file.name}</p>
          <p><strong>Type:</strong> {file.type}</p>
          <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
// Usage example: