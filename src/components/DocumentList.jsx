import DocumentIcon from './DocumentIcon';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function DocumentList({ documents }) {
  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <DocumentIcon key={doc.id} document={doc} />
      ))}
    </div>
  );
} 