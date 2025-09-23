"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react";

export default function FileUpload({ onFileLoad, isLoading }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [uploadMessage, setUploadMessage] = useState("");

  const validateCsvFile = useCallback((file) => {
    // Check file type
    if (!file.type.includes("csv") && !file.name.endsWith(".csv")) {
      return { valid: false, message: "Please upload a CSV file (.csv)" };
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return { valid: false, message: "File size must be less than 50MB" };
    }

    return { valid: true };
  }, []);

  const handleFile = useCallback(
    async (file) => {
      const validation = validateCsvFile(file);

      if (!validation.valid) {
        setUploadStatus("error");
        setUploadMessage(validation.message);
        return;
      }

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const csvText = e.target.result;

          // Basic CSV validation
          const lines = csvText.trim().split("\n");
          if (lines.length < 2) {
            setUploadStatus("error");
            setUploadMessage(
              "CSV file must contain at least a header row and one data row"
            );
            return;
          }

          // Check if it looks like book data (has expected columns)
          const headers = lines[0].toLowerCase();
          const expectedColumns = ["title", "author", "genre", "year", "isbn"];
          const hasExpectedStructure = expectedColumns.some((col) =>
            headers.includes(col)
          );

          if (!hasExpectedStructure) {
            setUploadStatus("error");
            setUploadMessage(
              "CSV should contain book data with columns like Title, Author, Genre, Year, ISBN"
            );
            return;
          }

          setUploadStatus("success");
          setUploadMessage(
            `Successfully loaded ${(lines.length - 1).toLocaleString()} records`
          );
          onFileLoad(csvText);

          // Clear success message after 3 seconds
          setTimeout(() => {
            setUploadStatus(null);
            setUploadMessage("");
          }, 3000);
        };

        reader.onerror = () => {
          setUploadStatus("error");
          setUploadMessage("Error reading file. Please try again.");
        };

        reader.readAsText(file);
      } catch (error) {
        setUploadStatus("error");
        setUploadMessage("Error processing file. Please try again.");
      }
    },
    [validateCsvFile, onFileLoad]
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  const clearStatus = useCallback(() => {
    setUploadStatus(null);
    setUploadMessage("");
  }, []);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-accent/5"
        } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Upload
              className={`w-8 h-8 text-primary ${
                dragActive ? "animate-bounce" : ""
              }`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {dragActive ? "Drop your CSV file here" : "Upload CSV File"}
            </h3>
            <p className="text-muted-foreground text-sm">
              Drag and drop your CSV file here, or click to browse
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Supported format: CSV (.csv)</p>
            <p>Maximum file size: 50MB</p>
            <p>Expected columns: Title, Author, Genre, PublishedYear, ISBN</p>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Processing file...
            </div>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {uploadStatus && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg border ${
            uploadStatus === "success"
              ? "bg-success/10 border-success/20 text-success"
              : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}
        >
          {uploadStatus === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm flex-1">{uploadMessage}</span>
          <button
            onClick={clearStatus}
            className="p-1 hover:bg-current/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sample Data Option */}
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-3">
          Don't have a CSV file? Try our sample data
        </div>
        <button
          // onClick={() => {
          //   // This will be handled by the parent component
          //   const event = new CustomEvent("loadSampleData")
          //   window.dispatchEvent(event)
          // }}
          onClick={() => {
            window.open("/sample_data.csv", "_blank");
          }}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors disabled:opacity-50"
        >
          <FileText className="w-4 h-4" />
          Load Sample Data (10,500+ books)
        </button>
      </div>
    </div>
  );
}
