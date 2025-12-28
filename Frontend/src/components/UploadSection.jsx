import { useState } from 'react';

const UploadSection = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setUploadStatus('');
    } else {
      setUploadStatus('Please select a valid PDF file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setUploadStatus('');
    } else {
      setUploadStatus('Please drop a valid PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setUploadStatus('Please select a PDF file first');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('http://localhost:3000/api/pdf/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus('✓ PDF uploaded successfully!');
        setTimeout(() => {
          setFile(null);
          setUploadStatus('');
        }, 3000);
      } else {
        setUploadStatus(`Error: ${data.message || 'Upload failed'}`);
      }
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus('');
  };

  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Upload Your PDF
          </h2>
          <p className="text-lg text-gray-600">
            Drag and drop your file or click to browse
          </p>
        </div>

        <div className="bg-white backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
          <form onSubmit={handleSubmit}>
            {/* Drag & Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50 scale-[1.02]'
                  : 'border-gray-300 hover:border-blue-400'
              } ${file ? 'border-blue-500 bg-blue-50/50' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="p-10 text-center">
                {!file ? (
                  <>
                    <div className="mb-6">
                      <div className="bg-blue-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4 shadow-lg">
                        <svg
                          className="w-12 h-12 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      Drop your PDF here
                    </h3>
                    <p className="text-gray-500 text-lg mb-6">or click to browse from your computer</p>
                    <label className="cursor-pointer group">
                      <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 shadow-xl transform hover:-translate-y-1 hover:scale-105">
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Select PDF File
                        </span>
                      </span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-gray-400 text-sm mt-6">Maximum file size: 10MB</p>
                  </>
                ) : (
                  <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-600 rounded-2xl p-3 shadow-lg">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900 text-xl mb-1">
                          {file.name}
                        </p>
                        <p className="text-gray-500 text-base">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all p-3 rounded-lg"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status Message */}
            {uploadStatus && (
              <div
                className={`mt-6 p-4 rounded-xl text-center font-semibold text-lg ${
                  uploadStatus.includes('✓')
                    ? 'bg-green-600 text-white shadow-xl shadow-green-500/50'
                    : uploadStatus.includes('Error')
                    ? 'bg-red-50 text-red-600 border-2 border-red-200'
                    : 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                }`}
              >
                {uploadStatus}
              </div>
            )}

            {/* Submit Button */}
            {file && (
              <button
                type="submit"
                disabled={isUploading}
                className={`w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold text-xl transition-all duration-300 ${
                  isUploading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-1 hover:scale-[1.02]'
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Your PDF...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Upload & Process PDF
                  </span>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
