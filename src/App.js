import './App.css';
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import SmartTextParser from './utils/main/SmartTextParser';
import Header from './components/layouts/Header';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />
      <main className='lg:px-40 lg:py-10 md:p-8 p-2 container mx-auto'>      
        <h1 className="text-3xl font-bold mb-6 text-center p-4 md:p-0">Great! Please upload your CV for a quick start</h1>  
        
        <FileUpload onFileSelect={setSelectedFile} disabled={isLoading} />
        <SmartTextParser file={selectedFile} setLoadingState={setLoading} />

      </main>
    </div>    
  );
}

export default App;