import { useEffect, useState } from "react";
import PDFToText from "react-pdftotext";
import Tesseract from "tesseract.js";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import mammoth from "mammoth";
import ResumeForm from "../components/ResumeForm";
import StatusNotice from "../components/ui/StatusNotice";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

console.log("SmartTextParser component initialized");

const SmartTextParser = ({ file }) => {

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [usedOCR, setUsedOCR] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Function to extract text from PDF using Tesseract.js
  const extractTextFromImage = async (imageUrl) => {
    const result = await Tesseract.recognize(imageUrl, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text" && m.progress != null) {
          setProgress(m.progress); // Update progress for OCR
        }
      },
    });     
    return result.data.text;
  };

  // Function to extract text from PDF using pdfjs-dist
  const extractTextUsingOCR = async () => {

    const pdf = await getDocument(await file.arrayBuffer()).promise; // Load PDF document 
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
    setText("");
    setProgress(0);
    setUsedOCR(false);
    setError("");
    setStatusMessage("");

    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    console.log("Processing file:", fileName, "Type:", fileType);

    try {
      // Handle PDF
      if (fileType === "application/pdf") {
        setStatusMessage("Extracting text from PDF...");

        try {          
          const extracted = await PDFToText(file); // Use react-pdftotext to extract text from PDF
          if (!extracted.trim()) throw new Error("Empty or unreadable PDF text."); // Fallback to OCR if no text found
          setText(extracted.trim()); // Set the extracted text
          setStatusMessage("Successfully extracted PDF text.");

        } catch (err) {
          setUsedOCR(true); // Indicate that OCR will be used
          setStatusMessage("Falling back to OCR (PDF text unreadable)..."); 
          const ocrResult = await extractTextUsingOCR(); 
          setText(ocrResult.trim());
          setStatusMessage("OCR completed from PDF.");
        }

      // Handle image files
      } else if (
        fileType.startsWith("image/") && 
        (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".png"))
      ) {
        setStatusMessage("Running OCR on image...");
        const imageUrl = URL.createObjectURL(file); 
        const imageText = await extractTextFromImage(imageUrl);

        if (!imageText.trim()) {
          setError("No text detected in image. Try uploading a clearer resume.");
          setStatusMessage("OCR failed: No readable text found.");
          setLoading(false);
          return;
        }

        setText(imageText.trim());
        setStatusMessage("OCR completed from image.");

      // Handle .docx
      } else if (
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileName.endsWith(".docx")
      ) {
        console.log("Extracting text from DOCX file:", fileName);
        setStatusMessage("Extracting text from DOCX...");
        const arrayBuffer = await file.arrayBuffer();
        const { value: docxText } = await mammoth.extractRawText({ arrayBuffer });
        setText(docxText?.trim() || "");
        setStatusMessage("Successfully extracted DOCX content.");

      // Handle .doc (unsupported)
      } else if (
        fileName.endsWith(".doc")
      ) {
        setError("DOC files are not supported. Please convert to .docx or PDF.");
        setStatusMessage("Upload failed: unsupported DOC format.");

      // Invalid file type
      } else 
      {
        setError("Unsupported file type. Please upload a PDF, DOCX");
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

  useEffect(() => {
    // If there's a status or error, auto-clear it after 5 seconds
    if (statusMessage || error || usedOCR) {
      const timeoutId = setTimeout(() => {
        setStatusMessage("");
        setError("");
        setUsedOCR(false);
      }, 10000);

      // Clean up timeout when component unmounts or file changes
      return () => clearTimeout(timeoutId);
    }
  }, [statusMessage, error, usedOCR]);

  return (
    <div>
      {/* Statuses */}
      <div className="space-y-2 mb-4">

        <StatusNotice
          type="info"
          message={statusMessage}
          show={Boolean(statusMessage)}
        />

        <StatusNotice
          type="warning"
          message="We used OCR because the document’s text was not readable."
          show={usedOCR && !loading}
        />

        <StatusNotice
          type="error"
          message={error}
          show={Boolean(error)}
        />
      </div>
      
      {/* Loading Bar */}
      {loading && (
        <div className="w-full bg-gray-200 rounded h-3 mb-4 overflow-hidden">
          <div
            className="h-3 bg-blue-600 transition-all"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          ></div>
        </div>
      )}
      

      <div className={`mt-6 transition-opacity duration-200 ${loading ? "pointer-events-none opacity-50" : ""}`}>
        <ResumeForm extractedData={text} />
      </div>
    </div>
    
  );
};

export default SmartTextParser;
