import React, { useState, useEffect, FC } from 'react';
import { MarcData } from '../types';
import styled from 'styled-components';

interface DataDownloadProps {
  marcData: MarcData;
}

const StyledButton = styled.button`
  && {
    background-color: rgb(40, 75, 99);
    border-radius: 5px;
    border: none;
    margin-right: 1rem;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    color: white;
    cursor: pointer;

    &:hover,
    &:focus {
      background-color: rgb(0, 31, 52);
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
      <StyledButton onClick={downloadXmlContent}>Last ned XML</StyledButton>
      <StyledButton onClick={downloadLineContent}>Last ned Linjeformat</StyledButton>
    </>
  );
};

export default DataDownload;
