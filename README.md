# Resume Parser App

A lightweight, frontend-only resume parsing application built using React.js and Tailwind CSS. It extracts structured data such as name, email, work experience, and education from resume files in PDF, DOCX, JPG, and PNG formats. No backend required.

## Project Description

This application allows users to upload resumes and automatically extract and pre-fill relevant information into a structured form. It uses a combination of libraries to handle text-based PDFs, scanned PDFs/images, and Microsoft Word documents.

## Features

- Upload support for:
  - PDF (text-based and scanned)
  - DOCX
  - JPG, JPEG, PNG image files
- Text extraction using:
  - `react-pdftotext` for native PDF parsing
  - `pdf.js` and `tesseract.js` for scanned PDFs and images (OCR)
  - `mammoth.js` for extracting raw text from `.docx`
- Displays extracted resume text in a preview box
- Auto-fills a resume form with structured fields:
  - Name
  - Email
  - Phone
  - Work Experience
  - Education
- Editable form for making corrections before submission
- Displays status messages and OCR progress during parsing
- Error handling for unsupported or unreadable files

## How to Run Locally

1. Clone the repository:

git clone https://github.com/your-username/resume-parser-app.git
cd resume-parser-app

2. Install dependencies:

npm install

3. Start the development server:

npm start

4. Open http://localhost:3000 in your browser.

## How to Test

- Start the app using npm start

- Upload valid file formats:

    - resume.pdf (text-based)

    - scanned_resume.pdf (image-based PDF)

    - resume.docx

    - resume.jpg, resume.png

- Watch the status messages and progress bar update

- Verify that extracted data appears in the preview and form

- Submit the form (prints JSON to console or handles output)

- Upload invalid or empty files to test error handling

## Tech Stack
- React.js
- Tailwind CSS
- pdf.js
- tesseract.js
- react-pdftotext
- mammoth