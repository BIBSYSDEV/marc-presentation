import React, { FC } from 'react';
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
  const xmlPresentation = marcData.xmlPresentation
    ? marcData.xmlPresentation
    : 'Failed to parse a XML version. This may be due to an error while contacting the server for parsing, please try to refresh the page.';

  const linePresentation = marcData.linePresentation
    ? marcData.linePresentation
    : 'Failed to parse a lineformat version. This may be due to an error while contacting the server for parsing, please try to refresh the page.';

  return (
    <DataFieldWrapper>
      <DataField data-testid="marc-preview" value={showAsXMLInput ? xmlPresentation : linePresentation} readOnly />
    </DataFieldWrapper>
  );
};

export default DataDisplay;
