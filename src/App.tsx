import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataDisplay from './components/DataDisplay';
import Metadata from './components/Metadata';
import queryString from 'query-string';
import styled from 'styled-components';
import { MarcData } from './types';
import DataDownload from './components/DataDownload';
import Header from './components/Header';
import { ALMA_API_URL, AUTHORITY_API_URL } from './constants';

const queryParams = queryString.parse(window.location.search);

const ErrorTextField = styled.div`
  white-space: pre-line;
  font-weight: Bold;
`;

const StyledContentWrapper = styled.div`
  margin-left: 1rem;
`;

const RadioLabel = styled.label`
  margin-left: 0.5rem;
  cursor: pointer;
`;

const StyledRadioInput = styled.input`
  cursor: pointer;
`;

const RadioContainer = styled.div`
  margin: 2rem 0 1rem 0;
`;

const App = () => {
  const [showXMLPressed, setShowXMLPressed] = useState(true);
  const [marcData, setMarcData] = useState<MarcData>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const getAndParseXMLData = async () => {
      let sruUrl = '';
      if (queryParams.auth_id) {
        sruUrl = AUTHORITY_API_URL + '?auth_id=' + queryParams.auth_id;
      } else if (queryParams.mms_id) {
        sruUrl = ALMA_API_URL + '?mms_id=' + queryParams.mms_id;
        if (queryParams.institution) {
          sruUrl += '&institution=' + queryParams.institution;
        }
      }
      if (sruUrl === '') {
        setError(new Error(`Resource not found. \nSearch parameters have not been included in the URL.`));
        return;
      }
      try {
        setIsLoading(true);
        setError(undefined);
        const response = (await axios.get(sruUrl)).data;
        if (!response[0]) {
          setError(new Error('Failed to retrieve the resource. \nCheck that the input parameter(URL) is correct.'));
        } else {
          setMarcData(response[0]);
        }
      } catch (error: any) {
        setError(new Error(`Failed to retrieve the resource, please try again. \n (${error.message})`));
      } finally {
        setIsLoading(false);
      }
    };
    getAndParseXMLData().then();
  }, []);

  const showXML = () => {
    setShowXMLPressed(true);
  };

  const showLineFormat = () => {
    setShowXMLPressed(false);
  };

  return (
    <>
      <Header />
      <StyledContentWrapper>
        {error ? (
          <ErrorTextField>{error.message}</ErrorTextField>
        ) : isLoading ? (
          <h1>Laster data ...</h1>
        ) : (
          marcData && (
            <>
              <Metadata marcData={marcData} />
              <RadioContainer>
                Velg format:
                <StyledRadioInput
                  aria-labelledby="xml"
                  type="radio"
                  value="xml"
                  data-testid="radio-button-xml-format"
                  checked={showXMLPressed}
                  onChange={showXML}
                />
                <RadioLabel id="xml" onClick={showXML}>
                  XML
                </RadioLabel>
                <StyledRadioInput
                  aria-labelledby="linjeformat"
                  type="radio"
                  value="linjeFormat"
                  data-testid="radio-button-line-format"
                  checked={!showXMLPressed}
                  onChange={showLineFormat}
                />
                <RadioLabel id="linjeformat" onClick={showLineFormat}>
                  Linjeformat
                </RadioLabel>
              </RadioContainer>
              <DataDisplay marcData={marcData} showAsXMLInput={showXMLPressed} />
              <DataDownload marcData={marcData} />
            </>
          )
        )}
      </StyledContentWrapper>
    </>
  );
};

export default App;
