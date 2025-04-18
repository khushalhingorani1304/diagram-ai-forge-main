
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { FileIcon, FileWarningIcon, UploadIcon } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { GoogleGenAI } from "@google/genai";

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

  const { setDiagramFromJson, setNodes, setEdges } = useStore();


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

  
type Node = {
  id: string;
  data: { label: string };
  position: { x: number; y: number };
  type?: 'input' | 'output';
};

type Edge = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
};
  const parseToJson = (input: string): { nodes: Node[]; edges: Edge[] } | null => {
    try {
      const regex = /```(?:json)?\s*([\s\S]*?)\s*```/;
      const match = input.match(regex);
  
      if (!match || !match[1]) {
        console.error("No valid JSON block found in the input string.");
        return null;
      }
  
      const parsed = JSON.parse(match[1]);
      
      if (!parsed.nodes || !parsed.edges) {
        throw new Error("Parsed JSON doesn't have nodes or edges.");
      }
  
      return parsed;
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null;
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;
    
    setIsUploading(true);
    
    const oldNodeEdges = `{
  "nodes": [
    {
      "id": "1",
      "type": "input",
      "data": { "label": "Main Inlet Valve (V-100)" },
      "position": { "x": 100, "y": 50 }
    },
    {
      "id": "2",
      "data": { "label": "Flow Sensor (F-101)" },
      "position": { "x": 100, "y": 150 }
    },
    {
      "id": "3",
      "data": { "label": "Control Valve (V-102)" },
      "position": { "x": 100, "y": 250 }
    },
    {
      "id": "4",
      "data": { "label": "Pump (P-103)" },
      "position": { "x": 100, "y": 350 }
    },
    {
      "id": "5",
      "type": "output",
      "data": { "label": "Outlet" },
      "position": { "x": 100, "y": 450 }
    }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "animated": true },
    { "id": "e2-3", "source": "2", "target": "3" },
    { "id": "e3-4", "source": "3", "target": "4" },
    { "id": "e4-5", "source": "4", "target": "5" }
  ]
}`;
    const NodeEdges = `{
  "nodes": [
    {
      "id": "1",
      "data": {
        "label": "Pump-101",
        "component": "pump"
      },
      "position": {
        "x": 100,
        "y": 100
      }
    },
    {
      "id": "2",
      "data": {
        "label": "Valve-101",
        "component": "valve"
      },
      "position": {
        "x": 300,
        "y": 100
      }
    },
    {
      "id": "3",
      "data": {
        "label": "FT-101",
        "component": "flow_transmitter"
      },
      "position": {
        "x": 500,
        "y": 100
      }
    },
    {
      "id": "4",
      "data": {
        "label": "PI-101",
        "component": "pressure_indicator"
      },
      "position": {
        "x": 700,
        "y": 100
      }
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2",
      "animated": true
    },
    {
      "id": "e2-3",
      "source": "2",
      "target": "3",
    },
    {
      "id": "e3-4",
      "source": "3",
      "target": "4",
    }
  ]
}
`;

    try {

      // const result = await sendImageToGemini(uploadedFile, `the uplaoded image contains a p&id diagram , i want you to analyze the components used and then make a flowchart in the format of JSON , for e.g ${NodeEdges}`);
      // alert(result); // or display result in UI
      //   console.log(result);
      // const parsedJson = parseToJson(result);
      // setDiagramFromJson(parsedJson);
      // setEdges(parsedJson?.edges || []);
      // setNodes(parsedJson?.nodes || []);
        
        // setDiagramFromJson(parsedJson);
        
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
