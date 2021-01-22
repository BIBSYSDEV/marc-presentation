import React, { useState, useEffect, FC } from 'react';
import { Button } from '@material-ui/core';
import { MarcData } from '../types';

interface DataDownloadProps {
  marcData: MarcData;
}

const DataDownload: FC<DataDownloadProps> = ({ marcData }) => {
  const [xmlContent, setXmlContent] = useState('');
  const [lineContent, setLineContent] = useState('');

  useEffect(() => {
    setXmlContent(marcData.xmlPresentation ?? '');
    setLineContent(marcData.linePresentation ?? '');
  }, [marcData]);

  function createDownload(content: string, filename: string, mimetype: string) {
    const elem = window.document.createElement('a');
    const blob = new Blob([content], { type: mimetype });
    elem.download = filename;
    elem.href = window.URL.createObjectURL(blob);
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }

  const downloadXmlContent = () => {
    createDownload(xmlContent, 'marcpresentation.xml', 'application/xml');
  };

  const downloadLineContent = () => {
    createDownload(lineContent, 'marcpresentation.txt', 'text/plain');
  };

  return (
    <>
      <Button variant="outlined" onClick={downloadXmlContent}>
        Download XML
      </Button>
      {'  '}
      <Button variant="outlined" onClick={downloadLineContent}>
        Download Lineformat
      </Button>
    </>
  );
};

export default DataDownload;
