import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import DataDisplay from './components/DataDisplay';
import Metadata from './components/Metadata';
import queryString from 'query-string';
import styled from 'styled-components';
import { MarcData } from './types';
import DataDownload from './components/DataDownload';
import Header from './components/Header';
import { ALMA_API_URL, AUTHORITY_API_URL } from './constants';

const queryParams = queryString.parse(window.location.search);

const OuterContainer = styled.div`
  background-color: #fafafa;
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
`;

const ErrorTextField = styled.div`
  white-space: pre-line;
  font-weight: Bold;
`;

const RadioLabel = styled.label`
  margin-right: 0.5rem;
  cursor: pointer;
`;

const RadioContainer = styled.div`
  font-family: Barlow, sans-serif;
  font-size: 1.25rem;
  margin-right: 1rem;
  margin-top: 0.5rem;
  display: inline-block;
  margin-left: 1rem;
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
        const marcDataList = (await axios.get(sruUrl)).data;
        setMarcData(marcDataList[0]);
        setError(undefined);
        if (!marcDataList[0]) {
          setError(new Error('Failed to retrieve the resource. \nCheck that the input parameter(URL) is correct.'));
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
    <OuterContainer>
      <Header />
      {isLoading ? (
        <h1>Laster data ...</h1>
      ) : error ? (
        <ErrorTextField>{error.message}</ErrorTextField>
      ) : (
        marcData && (
          <>
            <Metadata marcData={marcData} />
            <RadioContainer>
              Velg format:
              <input aria-labelledby="xml" type="radio" value="xml" checked={showXMLPressed} onChange={showXML} />
              <RadioLabel id="xml" onClick={showXML}>
                XML
              </RadioLabel>
              <input
                aria-labelledby="linjeformat"
                type="radio"
                value="linjeFormat"
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
    </OuterContainer>
  );
};

export default App;
