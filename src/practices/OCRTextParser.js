import React, { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const OCRTextParser = ({ file }) => {
  const [ocrText, setOcrText] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const extractTextFromImage = async (image) => {
    return Tesseract.recognize(image, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress((prev) => Math.min(prev + m.progress / 10, 1));
        }
      },
    }).then(({ data: { text } }) => text);
  };

  const extractTextFromPDF = async () => {
    setLoading(true);
    setProgress(0);
    const pdf = await getDocument(await file.arrayBuffer()).promise;
    const numPages = pdf.numPages;
    let fullText = "";

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const text = await extractTextFromImage(canvas);
      fullText += text + "\n\n";

      setProgress(pageNum / numPages); // Update progress per page
    }

    setOcrText(fullText);
    setLoading(false);
  };

  const extractText = async () => {
    if (!file) return;

    if (file.type === "application/pdf") {
      await extractTextFromPDF();
    } else if (file.type.startsWith("image/")) {
      setLoading(true);
      const text = await extractTextFromImage(file);
      setOcrText(text);
      setLoading(false);
    }
  };

  useEffect(() => {
    extractText();
    // eslint-disable-next-line
  }, [file]);

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">OCR Text Output</h3>

      {loading && (
        <div className="w-full bg-gray-200 rounded h-3 mb-4 overflow-hidden">
          <div
            className="h-3 bg-green-600 transition-all"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          ></div>
        </div>
      )}

      <textarea
        className="w-full h-80 border p-3 text-sm font-mono rounded-lg shadow"
        value={ocrText}
        readOnly
        placeholder="OCR result will appear here..."
      ></textarea>

      {loading && <p className="text-sm text-gray-500 mt-2">Running OCR, please wait...</p>}
    </div>
  );
};

export default OCRTextParser;
