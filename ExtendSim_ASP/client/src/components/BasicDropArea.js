import React from 'react';
import {useDropzone} from 'react-dropzone';

// function BasicDropArea(props) {
const BasicDropArea = (props) => {
    const { getRootProps, getInputProps} = useDropzone({
      getFilesFromEvent: event => myCustomFileGetter(event, props.handleDropEvents, props.updateScenarioState)
      });  
      return (
        <div>
          <label htmlFor="drop-area" className="scenario-input-labels">Factor Data Files Drop Zone:</label>
          <div {...getRootProps({className: 'dropzone'})} id="drop-area">
            <input {...getInputProps()} type="file" id="fileElem" multiple></input>
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        </div>
      )   
    }
    
    async function myCustomFileGetter(event, handleDropEvents, callback) {
      const files = [];
      const fileList = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    
      for (var i = 0; i < fileList.length; i++) {
        const file = fileList.item(i);
        
        Object.defineProperty(file, 'myProp', {
          value: true
        });
    
        files.push(file);
      }
      if (fileList.length > 0) {
        handleDropEvents(files, callback);
      }
      return files;
    }

    export default BasicDropArea;