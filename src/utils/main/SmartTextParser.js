import { useEffect, useState } from "react";
import PDFToText from "react-pdftotext";
import Tesseract from "tesseract.js";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import mammoth from "mammoth";
import ResumeForm from "../../components/ResumeForm";
import StatusNotice from "../../components/ui/StatusNotice";
import extractWithAI from "./extractWithAI";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const SmartTextParser = ({ file }) => {
  const [structuredData, setStructuredData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [usedOCR, setUsedOCR] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const extractTextFromImage = async (imageUrl) => {
    const result = await Tesseract.recognize(imageUrl, "eng", {
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

      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      const imageUrl = URL.createObjectURL(blob);
      const pageText = await extractTextFromImage(imageUrl);
      fullText += pageText + "\n\n";
      setProgress(pageNum / pdf.numPages);
    }

    return fullText;
  };

  const extractSmartText = async () => {
    if (!file) return;

    setLoading(true);
    setStructuredData(null);
    setProgress(0);
    setUsedOCR(false);
    setError("");
    setStatusMessage("");

    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    try {
      let rawText = "";

      if (fileType === "application/pdf") {
        setStatusMessage("Extracting text from PDF...");
        try {
          const extracted = await PDFToText(file);
          if (!extracted.trim()) throw new Error("Empty or unreadable PDF text.");
          rawText = extracted.trim();
          setStatusMessage("Successfully extracted PDF text.");
        } catch (err) {
          setUsedOCR(true);
          setStatusMessage("Falling back to OCR...");
          rawText = await extractTextUsingOCR();
          setStatusMessage("OCR completed from PDF.");
        }
      } else if (
        fileType.startsWith("image/") &&
        (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".png"))
      ) {
        setStatusMessage("Running OCR on image...");
        const imageUrl = URL.createObjectURL(file);
        rawText = await extractTextFromImage(imageUrl);
        if (!rawText.trim()) throw new Error("No readable text found in image.");
        setStatusMessage("OCR completed from image.");
      } else if (
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileName.endsWith(".docx")
      ) {
        setStatusMessage("Extracting text from DOCX...");
        const arrayBuffer = await file.arrayBuffer();
        const { value: docxText } = await mammoth.extractRawText({ arrayBuffer });
        rawText = docxText?.trim() || "";
        setStatusMessage("Successfully extracted DOCX content.");
      } else if (fileName.endsWith(".doc")) {
        setError("DOC files are not supported. Please convert to .docx or PDF.");
        setStatusMessage("Upload failed: unsupported DOC format.");
        setLoading(false);
        return;
      } else {
        setError("Unsupported file type. Please upload a PDF, DOCX, or image.");
        setStatusMessage("Upload failed: unsupported file type.");
        setLoading(false);
        return;
      }

      // 🔍 Pass the parsed text to extractWithAI
      try {
        const aiData = await extractWithAI(rawText);
        setStructuredData(aiData);
        setStatusMessage("Structured AI extraction completed.");
      } catch (aiError) {
        console.error("AI extraction error:", aiError);
        setError("Failed to extract structured data: " + aiError.message);
        setStatusMessage("AI parsing failed.");
      }
    } catch (err) {
      console.error("Processing error:", err);
      setError("Failed to process file.");
      setStatusMessage("Processing failed.");
    }

    setLoading(false);
  };

  useEffect(() => {
    extractSmartText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    if (statusMessage || error || usedOCR) {
      const timeoutId = setTimeout(() => {
        setStatusMessage("");
        setError("");
        setUsedOCR(false);
      }, 10000);
      return () => clearTimeout(timeoutId);
    }
  }, [statusMessage, error, usedOCR]);

  return (
    <div>
      <div className="space-y-2 mb-4">
        <StatusNotice type="info" message={statusMessage} show={!!statusMessage} />
        <StatusNotice
          type="warning"
          message="We used OCR because the document’s text was not readable."
          show={usedOCR && !loading}
        />
        <StatusNotice type="error" message={error} show={!!error} />
      </div>

      {loading && (
        <div className="w-full bg-gray-200 rounded h-3 mb-4 overflow-hidden">
          <div
            className="h-3 bg-blue-600 transition-all"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          ></div>
        </div>
      )}

      <div className={`mt-6 transition-opacity duration-200 ${loading ? "pointer-events-none opacity-50" : ""}`}>
        <ResumeForm structuredData={structuredData} disabled={loading} />
      </div>
    </div>
  );
};

export default SmartTextParser;
