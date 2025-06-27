import { useEffect, useState } from "react";
import PDFToText from "react-pdftotext";
import Tesseract from "tesseract.js";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import mammoth from "mammoth";
import ResumeForm from "./ResumeForm";

// Set PDF.js worker source

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

console.log("SmartTextParser component initialized");

// SmartTextParser component to handle resume text extraction
const SmartTextParser = ({ file }) => {

  // State variables to manage file processing
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
      } else if (fileName.endsWith(".doc")) {
        setError("DOC files are not supported. Please convert to .docx or PDF.");
        setStatusMessage("Upload failed: unsupported DOC format.");

      // Invalid file type
      } else {
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
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-700 mb-2">
            Edit Extracted Resume Details
          </h4>
          <ResumeForm extractedData={text} />
        </div>
      )}

      {loading && (
        <p className="text-sm text-gray-500 mt-2">Processing file, please wait...</p>
      )}
    </div>
  );
};

export default SmartTextParser;
