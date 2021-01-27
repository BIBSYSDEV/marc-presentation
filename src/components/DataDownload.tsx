import React, { useState, useEffect, FC } from 'react';
import { MarcData } from '../types';
import styled from 'styled-components';

interface DataDownloadProps {
  marcData: MarcData;
}

const Buttons = styled.button`
  && {
    background-color: rgb(40, 75, 99);
    border-radius: 5px;
    border: 1px solid;
    border-color: rgb(40, 75, 99);
    margin-left: 1rem;
    margin-top: 0.7rem;
    padding: 0.5rem;
    font-family: Barlow, sans-serif;
    font-size: 1.1rem;
    color: white;
    cursor: pointer;
    &:focus {
      background-color: orange;
    }
  }
`;

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
      <Buttons onClick={downloadXmlContent}>Last ned XML</Buttons>
      {'  '}
      <Buttons onClick={downloadLineContent}>Last ned Linjeformat</Buttons>
    </>
  );
};

export default DataDownload;
