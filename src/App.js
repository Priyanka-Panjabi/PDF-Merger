import './App.css';
import { useState } from 'react';
import { PDFDocument } from "pdf-lib";

function App() {

  const [files, setFile] = useState([]);
  const [mergedFile, setMergeFile] = useState();

  const uploadFile = async (e) => {
    await setFile([...files, e.target.files[0]]);
    console.log(files)
  }
  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    })
  }

  const downloadMerged = () => {
    // const link = document.createElement('a');
    // const link = document.getElementById("link");
    // link.download = "MergedPdf";
    let binaryData = [];
    binaryData.push(mergedFile);
    // link.href = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }))
    window.location.href= URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }))
  }

  const mergeFiles = async () => {
    let doc = await PDFDocument.create();

    let pdfFirst = await PDFDocument.load(await readFileAsync(files[0]));
    let pdfSecond = await PDFDocument.load(await readFileAsync(files[1]));

    const pdfFirstInd = await doc.copyPages(pdfFirst, pdfFirst.getPageIndices());

    for (const page of pdfFirstInd) {
      doc.addPage(page);
    }

    const pdfSecondInd = await doc.copyPages(pdfSecond, pdfSecond.getPageIndices());

    for (const page of pdfSecondInd) {
      doc.addPage(page);
    }

    const mergedPdfFile = await doc.save();
    setMergeFile(mergedPdfFile);
  }

  return (
    <div className="App">
      <input type="file" onChange={uploadFile}></input>
      <button onClick={mergeFiles}>Merge</button>
      <button onClick={downloadMerged}>Download</button>
    </div>
  );
}

export default App;
