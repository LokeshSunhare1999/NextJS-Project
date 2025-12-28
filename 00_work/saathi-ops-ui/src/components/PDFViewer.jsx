'use client';
import { useState } from 'react';
// import 'core-js/proposals/promise-with-resolvers';

import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

// Load PDF worker
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url
// ).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = ({ pdfUrl, loadingComponent }) => {
  const [numPages, setNumPages] = useState(null);
  const handlePDFLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Document
      loading={loadingComponent}
      file={pdfUrl}
      onLoadSuccess={handlePDFLoadSuccess}
    >
      {[...new Array(numPages)].map((_, idx) => (
        <Page scale={2} pageNumber={idx + 1} />
      ))}
    </Document>
  );
};

export default PDFViewer;
