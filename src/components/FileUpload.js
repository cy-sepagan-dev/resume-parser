import React, { useState, useRef } from 'react';
import Button from './ui/Button';

const FileUpload = ({ onFileSelect, disabled }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const uploaded = e.target.files[0];
    if (!uploaded) return;
    setFile(uploaded);
    onFileSelect(uploaded);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    setFile(droppedFile);
    onFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const openFileDialog = () => {
    if (!disabled) fileInputRef.current.click();
  };

  return (
    <div>
      <div
        className={`flex flex-col items-center gap-4 p-6 shadow-sm rounded-xl bg-white w-full max-w-lg mx-auto mb-6 ${
          disabled ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full flex flex-col items-center justify-center p-10 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <p className="text-gray-600">Drag & Drop your file here</p>
          <p className="text-gray-400 text-sm mt-1">(or click the button below to browse)</p>
        </div>

        {/* Browse Button */}
        <Button 
          onClick={openFileDialog}
          disabled={disabled}
          variant="secondary"
          classNames="bg-blue-500 text-white hover:bg-blue-500 px-6 py-2 rounded-lg transition"
        >
          Browse File
        </Button>
        {/* <button
          onClick={openFileDialog}
          disabled={disabled}
          type='button'
          variant="secondary"
          className={`px-4 py-2 rounded-lg transition text-white ${
            disabled
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Browse File
        </button> */}

        {/* Hidden Input */}
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleChange}
          ref={fileInputRef}
          disabled={disabled}
          className="hidden"
        />

        {/* File Info */}
        {file && (
          <div className="text-sm text-gray-600 text-center">
            <p><strong>File:</strong> {file.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
