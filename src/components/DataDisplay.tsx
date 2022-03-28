import React, { FC } from 'react';
import styled from 'styled-components';
import { MarcData } from '../types';

const DataField: any = styled.textarea`
  height: 20rem;
  width: 90%;
  resize: none;
`;

const DataFieldWrapper = styled.div`
  height: 20rem;
  width: 90%;
`;

const MarcPostLabel = 'marc-post-label';

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
    <>
      <label id={MarcPostLabel}>Marc-post:</label>
      <DataFieldWrapper>
        <DataField
          id="marc-post-textarea"
          aria-labelledby={MarcPostLabel}
          readonly
          data-testid="marc-preview"
          value={showAsXMLInput ? xmlPresentation : linePresentation}
          readOnly
        />
      </DataFieldWrapper>
    </>
  );
};

export default DataDisplay;
