import React, { useEffect, useState } from "react";
import PDFToText from "react-pdftotext";
import Tesseract from "tesseract.js";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import ResumeFieldExtractor from "./ResumeFieldExtractor";
import mammoth from "mammoth";


console.log("SmartTextParser component loaded");
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;



const SmartTextParser = ({ file }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [usedOCR, setUsedOCR] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const extractTextFromImage = async (image) => {
    const result = await Tesseract.recognize(image, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text" && m.progress != null) {
          setProgress(m.progress);
        }
      },
    });

    return result.data.text;
  };

  const extractTextUsingOCR = async () => {
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
    if (!file) return;

    setLoading(true);
    setText("");
    setProgress(0);
    setUsedOCR(false);
    setError("");
    setStatusMessage("");

    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    try {
        // Handle PDF (text-based first, fallback to OCR)
      if (fileType === "application/pdf") {

        setStatusMessage("Extracting text from PDF...");

        try {
          const extracted = await PDFToText(file);
          if (!extracted.trim()) throw new Error("Empty or unreadable PDF text.");
          setText(extracted);
          setStatusMessage("Successfully extracted PDF text.");
        } catch (err) {
          setUsedOCR(true);
          setStatusMessage("Falling back to OCR (PDF text unreadable)...");

          const ocrResult = await extractTextUsingOCR();
          setText(ocrResult);
          setStatusMessage("OCR completed from PDF.");
        }

        //  Handle images: jpg, jpeg, png
      } else if (
        fileType.startsWith("image/") &&
        (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".png"))
      ) {
        setStatusMessage("Running OCR on image...");
        const imageText = await extractTextFromImage(file);
        setText(imageText);
        setStatusMessage("OCR completed from image.");

        //  Handle .docx files
      } else if (
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileName.endsWith(".docx")
      ) {
        setStatusMessage("Extracting text from DOCX...");
        const arrayBuffer = await file.arrayBuffer();
        const { value: docxText } = await mammoth.extractRawText({ arrayBuffer });
        setText(docxText);
        setStatusMessage("Successfully extracted DOCX content.");

        //  Handle .doc files
      } else if (fileName.endsWith(".doc")) {
        setError("DOC files are not supported. Please convert to .docx or PDF.");
        setStatusMessage("Upload failed: unsupported DOC format.");

      } else {
        setError("Unsupported file type. Please upload a PDF, DOCX, JPG, or PNG.");
        setStatusMessage("Upload failed: unsupported file type.");
      }
    } catch (err) {
      console.error("Error while parsing:", err);
      setError("Failed to process file. Try a different format or clearer version.");
      setStatusMessage("Processing failed.");
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

      {statusMessage && (
        <p className="text-sm text-blue-700 font-medium mb-2">{statusMessage}</p>
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

      {text && !loading && (
        <ResumeFieldExtractor rawText={text} />
      )}

      {loading && <p className="text-sm text-gray-500 mt-2">Processing file, please wait...</p>}
    </div>
  );
};

export default SmartTextParser;