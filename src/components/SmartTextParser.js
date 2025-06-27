import React, { useEffect, useState } from "react";
import PDFToText from "react-pdftotext";
import Tesseract from "tesseract.js";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";


console.log("SmartTextParser component loaded");
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;


const SmartTextParser = ({ file }) => {

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [usedOCR, setUsedOCR] = useState(false);
  const [error, setError] = useState("");

  console.log("SmartTextParser initialized with file:", file);

  const extractTextFromImage = async (image) => {
    const result = await Tesseract.recognize(image, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress((prev) => Math.min(prev + m.progress / 10, 1));
        }
      },
    });

    return result.data.text;
  };

  const extractTextUsingOCR = async () => {
    if (file.type !== "application/pdf") return;

    const pdf = await getDocument(await file.arrayBuffer()).promise;
    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
      const pageText = await extractTextFromImage(canvas);
      fullText += pageText + "\n\n";
      setProgress(pageNum / pdf.numPages);
    }

    return fullText;
  };

  const extractSmartText = async () => {
    if (!file || file.type !== "application/pdf") return;

    setLoading(true);
    setText("");
    setProgress(0);
    setUsedOCR(false);
    setError("");

    try {
      const extracted = await PDFToText(file);
      if (!extracted.trim()) throw new Error("Empty or unreadable PDF text.");
      setText(extracted);
    } catch (err) {
      console.warn("Falling back to OCR due to error:", err.message);
      setUsedOCR(true);

      try {
        const ocrResult = await extractTextUsingOCR();
        setText(ocrResult);
      } catch (ocrError) {
        setError("OCR failed. Try using a clearer file.");
        console.error("OCR Error:", ocrError);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    extractSmartText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Smart Resume Text Extractor
      </h3>

      {loading && (
        <div className="w-full bg-gray-200 rounded h-3 mb-4 overflow-hidden">
          <div
            className="h-3 bg-blue-600 transition-all"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          ></div>
        </div>
      )}

      {usedOCR && !loading && (
        <p className="text-sm text-yellow-600 font-medium mb-2">
          Used OCR fallback (PDF text unreadable).
        </p>
      )}

      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

      <textarea
        className="w-full h-80 border p-3 text-sm font-mono rounded-lg shadow"
        value={text}
        readOnly
        placeholder="Parsed resume text will appear here..."
      ></textarea>

      {loading && <p className="text-sm text-gray-500 mt-2">Processing file, please wait...</p>}
    </div>
  );
};

export default SmartTextParser;
