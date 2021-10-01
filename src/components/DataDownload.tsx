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

    &:hover {
      background-color: rgb(0, 31, 52);
    }

    &:focus {
      background-color: rgb(84, 118, 140);
    }
  }
`;

export const filename_XML_format = 'marcpresentation.xml';
export const filename_line_format = 'marcpresentation.txt';

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
    createDownload(xmlContent, filename_XML_format, 'application/xml');
  };

  const downloadLineContent = () => {
    createDownload(lineContent, filename_line_format, 'text/plain');
  };

  return (
    <>
      <StyledButton data-testid="download-xml-format-button" onClick={downloadXmlContent}>
        Last ned XML
      </StyledButton>
      <StyledButton data-testid="download-line-format-button" onClick={downloadLineContent}>
        Last ned Linjeformat
      </StyledButton>
    </>
  );
};

export default DataDownload;
