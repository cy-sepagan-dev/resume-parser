import React, { useState } from "react";
import axios from "axios";

const ResumeUploaderAI = () => {
  const [file, setFile] = useState(null);
  const [parsedText, setParsedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setParsedText("");
    setError("");
  };

    const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setParsedText("");
    setError("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
        const response = await axios.post("http://localhost:3000/api/parse", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        });

        setParsedText(response.data.extractedText); // ✅ show parsed content
        console.log("✅ Upload successful:", response.data);
    } catch (error) {
        setError(error?.response?.data?.error || "Upload failed.");
        console.error("Upload failed:", error);
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Upload Your Resume</h2>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />

      {file && (
        <p className="text-sm text-green-700">
          Selected file: <strong>{file.name}</strong>
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Parsing..." : "Upload and Parse"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {parsedText && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg whitespace-pre-wrap text-sm text-gray-800">
          <h3 className="font-semibold mb-2">Parsed Resume Text:</h3>
          {parsedText}
        </div>
      )}
    </div>
  );
};

export default ResumeUploaderAI;
