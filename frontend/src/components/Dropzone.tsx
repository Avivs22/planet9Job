import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { CSSProperties } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close"; // Import Close (X) icon from MUI
import { Button } from "@mui/material";
import { Download } from "@mui/icons-material";

const baseStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: "8px",
  borderColor: "#eeeeee",
  borderStyle: "dotted",
  backgroundColor: "rgba(128, 128, 128, 0.5)",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  cursor: "pointer",
  width: "100%",
  flexGrow: 1,
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const downloadSampleContainerStyle = {
  padding: "10px",
  marginRight: "10px", 
  display: 'flex',
  flexDirection: 'column', 
  alignItems: 'center',
  justifyContent: 'center',
  border: "1px solid #ccc", 
  borderWidth: 2,
  borderRadius: "8px",
  backgroundColor: "rgba(128, 128, 128, 0.5)",
  color: 'white'
};

const handleDownload = () => {
  const link = document.createElement('a');
  link.href = '/sample.csv'; // Adjust the path based on your file location
  link.setAttribute('download', 'sample.csv'); // The name for the downloaded file
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export interface DropzoneProps {
  onDrop: (file: File | undefined) => void;
  maxNumOfFiles: number;
  isMultipleSelection: boolean;
}
function Dropzone(props: DropzoneProps) {
  const [file, setFile] = useState<File>();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: { "text/csv": [".csv"] },
    onDropAccepted: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      props.onDrop(acceptedFiles[0]);
    },
    maxFiles: 1,
    multiple: false,
  });

  const style = React.useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept],
  );

  const removeFile = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    event.stopPropagation();
    setFile(undefined);
    props.onDrop(undefined);
  };

  useEffect(() => {
    return () => file && setFile(undefined);
  }, [file]);

  return (
    <div style={{ display: "flex", flexGrow: 1 }}>
      <Button style={downloadSampleContainerStyle} onClick={handleDownload}>
        Download CSV sample
        <Download />
      </Button>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />

        {file ? (
          <aside>
            <InsertDriveFileIcon
              style={{ marginRight: "7px", verticalAlign: "-5px" }}
            />
            {file.name} - {file.size} bytes
            <CloseIcon
              onClick={removeFile}
              style={{
                marginLeft: "10px",
                verticalAlign: "2px",
                cursor: "pointer",
              }}
            />
          </aside>
        ) : (
          <p>Drag & drop a file here, or click to select a file</p>
        )}
      </div>
    </div>
  );
}

export default Dropzone;
