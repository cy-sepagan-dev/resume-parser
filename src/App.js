import './App.css';
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import SmartTextParser from './components/SmartTextParser';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <FileUpload onFileSelect={setSelectedFile} />
      {selectedFile && (
        <SmartTextParser file={selectedFile} />
      )}
    </div>
  );
}

export default App;