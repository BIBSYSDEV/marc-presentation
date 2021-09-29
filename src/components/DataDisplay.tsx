import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MarcData } from '../types';

const DataField = styled.textarea`
  height: 20rem;
  width: 90%;
  resize: none;
`;

const DataFieldWrapper = styled.div`
  height: 20rem;
  width: 90%;
`;

interface DataDisplayProps {
  marcData: MarcData;
  showAsXMLInput: boolean;
}

const DataDisplay: FC<DataDisplayProps> = ({ marcData, showAsXMLInput }) => {
  const [showAsXML, setShowAsXML] = useState(false);
  const [xmlPresentation, setXmlPresentation] = useState('');
  const [linePresentation, setLinePresentation] = useState('');

  useEffect(() => {
    setXmlPresentation(
      marcData.xmlPresentation
        ? marcData.xmlPresentation
        : 'Failed to parse a XML version. This may be due to an error while contacting the server for parsing, please try to refresh the page.'
    );
    setLinePresentation(
      marcData.linePresentation
        ? marcData.linePresentation
        : 'Failed to parse a lineformat version. This may be due to an error while contacting the server for parsing, please try to refresh the page.'
    );
    setShowAsXML(showAsXMLInput);
  }, [marcData, showAsXMLInput]);

  const showData = (): string => {
    if (showAsXML) {
      return xmlPresentation;
    } else {
      return linePresentation;
    }
  };

  return (
    <DataFieldWrapper>
      <DataField value={showData()} readOnly />
    </DataFieldWrapper>
  );
};

export default DataDisplay;
