import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataDisplay from './components/DataDisplay';
import Metadata from './components/Metadata';
import styled from 'styled-components';
import { MarcData } from './types';
import DataDownload from './components/DataDownload';
import Header from './components/Header';
import { ALMA_API_URL, AUTHORITY_API_URL } from './constants';

const AUTH_ID_URL_PARAM_NAME = 'auth_id';
const MMS_ID_URL_PARAM_NAME = 'mms_id';
const INSTITUTION_URL_PARAM_NAME = 'institution';

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
      const urlSearchParams = new URLSearchParams(window.location.search);
      const authId = urlSearchParams.get(AUTH_ID_URL_PARAM_NAME);
      const mmsId = urlSearchParams.get(MMS_ID_URL_PARAM_NAME);
      const institution = urlSearchParams.get(INSTITUTION_URL_PARAM_NAME);
      setIsLoading(true);
      setError(undefined);
      let sruUrl = '';
      if (authId) {
        sruUrl = `${AUTHORITY_API_URL}?${AUTH_ID_URL_PARAM_NAME}=${authId}`;
      } else if (mmsId) {
        sruUrl = `${ALMA_API_URL}?${MMS_ID_URL_PARAM_NAME}=${mmsId}`;
        if (institution) {
          sruUrl += `&${INSTITUTION_URL_PARAM_NAME}=${institution}`;
        }
      }
      if (!sruUrl) {
        setError(new Error(`Resource not found. \nSearch parameters have not been included in the URL.`));
        return;
      }
      try {
        const response = (await axios.get<MarcData[]>(sruUrl)).data;
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
      <main>
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
      </main>
    </>
  );
};

export default App;
