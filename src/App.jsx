import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Sätt worker path för PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);

  // Hämta lista på uppladdade dokument
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:8000/documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  // Hantera filuppladdning
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        fetchDocuments(); // Uppdatera dokumentlistan
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Dokumenthanterare</h1>
        
        {/* Uppladdningssektion */}
        <div className="mb-4">
          <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
            Ladda upp PDF
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Dokumentlista */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border p-4 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedPdf(`http://localhost:8000/documents/${doc.id}`)}
            >
              <div className="flex items-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 18h12a2 2 0 002-2V6a2 2 0 00-2-2h-3.93a2 2 0 01-1.66-.89l-.812-1.22A2 2 0 008.93 1H4a2 2 0 00-2 2v13a2 2 0 002 2z" />
                </svg>
                <span className="ml-2">{doc.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Viewer */}
      {selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setSelectedPdf(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Stäng
              </button>
            </div>
            <Document
              file={selectedPdf}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={Math.min(window.innerWidth * 0.8, 800)}
                />
              ))}
            </Document>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 