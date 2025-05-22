// app/upload/page.tsx
"use client";

import { use, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { CloudUpload, Close } from "@mui/icons-material";
import { toast, Toaster } from "react-hot-toast";
import { PREDICTION_URL } from "@/config/api-endpoints";
import { useRouter } from "next/navigation";

export default function UploadPage({
  isUser = false,
  mutipleFileUpload = false,
  maxFileCount = 1
}: {
  isUser?: boolean;
  mutipleFileUpload?: boolean;
  maxFileCount?: number;
}) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (mutipleFileUpload) {
      // append but cap at maxFileCount
      setFiles((prev) =>
        [...prev, ...acceptedFiles].slice(0, maxFileCount)
      );
    } else {
      // only keep the first
      setFiles(acceptedFiles.slice(0, 1));
    }
  }, [mutipleFileUpload, maxFileCount]);

  const onDropRejected = () => {
    toast.error("Invalid file type. Please upload a .csv, .xlsx or .xls file.");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: mutipleFileUpload,
    maxFiles: maxFileCount,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach((f) => formData.append("file", f, f.name));

    try {
      const res = await fetch(PREDICTION_URL, { method: "POST", body: formData });

      if (res.ok) {
        const { history_id } = await res.json();
        toast.success("Upload successful!");
        router.push(`/${isUser ? "user" : "admin"}/scan-history/${history_id}`);
        setFiles([]);
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Upload failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen w-full p-6">
      <Toaster position="top-right" />

      <Card className="w-full p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Upload Your File{mutipleFileUpload ? "s" : ""}
        </h2>

        <div
          {...getRootProps()}
          className={`
            w-full h-64 border-2 border-dashed rounded-lg 
            flex flex-col items-center justify-center 
            transition-colors
            ${isDragActive ? "border-blue-500" : "border-gray-300"}
          `}
        >
          <input {...getInputProps()} />
          <CloudUpload className="w-16 h-16 text-gray-400" />
          <span className="mt-3 text-gray-600 text-center">
            {isDragActive
              ? "Drop it here…"
              : `Drag & drop ${ mutipleFileUpload ? "" : "a "} .csv, .xlsx or .xls file${mutipleFileUpload ? "s" : ""}, or click to select`}
          </span>
        </div>

        {files.length > 0 && (
          <ul className="mt-4 space-y-2 max-h-40 overflow-y-auto">
            {files.map((f, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between bg-gray-50 p-3 rounded"
              >
                <div className="truncate">{f.name}</div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {(f.size / 1024).toFixed(2)} KB
                  </span>
                  <Close
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={() => removeFile(idx)}
                    titleAccess="Remove file"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        <Button
          color="primary"
          onPress={handleUpload}
          className="mt-6 w-full"
          disabled={files.length === 0}
        >
          {`Upload File${mutipleFileUpload ? "s" : ""}`}
        </Button>
      </Card>
    </div>
  );
}
