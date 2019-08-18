import React, {useCallback} from "react";
import ReactDOM from "react-dom";
import { useDropzone } from "react-dropzone";
// import "./styles.css";
import { Observer } from "mobx-react";

const BasicDropArea = () => {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, []);
  const {acceptedFiles, getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <Observer>
      {(getRootProps, getInputProps) => (
        <section className="container">
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
          <aside>
            <h4>Files</h4>
            <ul>{files}</ul>
          </aside>
        </section>
      )}
    </Observer>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<BasicDropArea />, rootElement);

export default BasicDropArea;
