
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { FileIcon, FileWarningIcon, UploadIcon } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";

const acceptedFileTypes = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "application/pdf": [".pdf"],
  "image/vnd.dxf": [".dxf"],
};

const Upload = () => {
  const navigate = useNavigate();
  const { setCurrentFile, createNewDiagramSession } = useStore();
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFileError(null);
      
      if (acceptedFiles.length === 0) {
        return;
      }
      
      const file = acceptedFiles[0];
      setUploadedFile(file);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 1,
    onDropRejected: () => {
      setFileError(
        "Invalid file type. Please upload a PNG, JPG, PDF, or DXF file."
      );
    },
  });

  const handleUpload = async () => {
    if (!uploadedFile) return;
    
    setIsUploading(true);
    
    try {
      // Simulate file processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setCurrentFile(uploadedFile);
      
      // Create a new diagram session with the file name as the title
      const title = uploadedFile.name.split(".")[0] || "Untitled Diagram";
      createNewDiagramSession(title);
      
      // Redirect to the diagram editor
      navigate("/diagram");
    } catch (error) {
      console.error("Upload failed:", error);
      setFileError("An error occurred during upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AppLayout title="Upload Diagram">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <h1 className="text-2xl font-bold sm:text-3xl">Upload P&ID Diagram</h1>
          <p className="mt-2 text-muted-foreground">
            Upload your P&ID diagram for AI-powered analysis and interaction
          </p>
        </motion.div>

        <div
          className="mb-8 overflow-hidden rounded-lg border-2 border-dashed border-primary/20 bg-muted/40 transition-colors hover:border-primary/50"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div
              className={`mb-4 rounded-full bg-primary/10 p-4 text-primary transition-transform ${
                isDragActive ? "scale-110" : ""
              }`}
            >
              <UploadIcon className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-medium">
              {isDragActive
                ? "Drop your file here"
                : "Drag & drop your P&ID diagram"}
            </h3>
            <p className="mb-4 max-w-md text-sm text-muted-foreground">
              Support for PNG, JPG, PDF and DXF files. The file will be
              processed by our AI engine for analysis.
            </p>
            <Button variant="outline" type="button">
              Browse Files
            </Button>
          </div>
        </div>

        {fileError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive"
          >
            <div className="flex items-center gap-2">
              <FileWarningIcon className="h-5 w-5" />
              <p>{fileError}</p>
            </div>
          </motion.div>
        )}

        {uploadedFile && !fileError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="overflow-hidden rounded-lg border bg-card">
              <div className="flex items-center gap-4 p-4">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <FileIcon className="h-8 w-8" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="default"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? "Processing..." : "Process File"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-lg border bg-card p-6"
        >
          <h3 className="mb-4 text-lg font-medium">Supported File Types</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="rounded-lg border bg-background p-4 text-center">
              <p className="text-xl font-bold">.PNG</p>
              <p className="text-sm text-muted-foreground">Image File</p>
            </div>
            <div className="rounded-lg border bg-background p-4 text-center">
              <p className="text-xl font-bold">.JPG</p>
              <p className="text-sm text-muted-foreground">Image File</p>
            </div>
            <div className="rounded-lg border bg-background p-4 text-center">
              <p className="text-xl font-bold">.PDF</p>
              <p className="text-sm text-muted-foreground">Document File</p>
            </div>
            <div className="rounded-lg border bg-background p-4 text-center">
              <p className="text-xl font-bold">.DXF</p>
              <p className="text-sm text-muted-foreground">CAD File</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Upload;
