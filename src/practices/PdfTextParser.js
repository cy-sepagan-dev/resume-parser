import React, { useEffect, useState } from "react";
import PDFToText from "react-pdftotext";

const PDFTextParser = ({ file }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const extractText = async () => {
      if (!file || file.type !== "application/pdf") return;

      try {
        const extracted = await PDFToText(file);
        setText(extracted);
        setError("");
      } catch (err) {
        setText("");
        setError("Failed to extract text from PDF. It may be a scanned image or encrypted.");
        console.error("PDF parsing error:", err);
      }
    };

    extractText();
  }, [file]);

  return (
    <div className="mt-6 max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Extracted Text</h3>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <textarea
        className="w-full h-80 border p-3 text-sm font-mono rounded-lg shadow"
        value={text}
        readOnly
        placeholder="Parsed resume content will appear here..."
      ></textarea>
    </div>
  );
};

export default PDFTextParser;
