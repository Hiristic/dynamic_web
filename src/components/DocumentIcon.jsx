import { DocumentIcon as DocIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function DocumentIcon({ document }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded"
      >
        <DocIcon className="h-6 w-6 text-blue-500" />
        <span>{document.name}</span>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">{document.name}</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Stäng
              </button>
            </div>
            <Document
              file={document.url}
              className="flex flex-col items-center"
              loading="Laddar dokument..."
              error="Det gick inte att ladda dokumentet."
            >
              <Page pageNumber={1} />
            </Document>
          </div>
        </div>
      )}
    </div>
  );
} 