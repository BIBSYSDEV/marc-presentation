import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import DataDisplay from './components/DataDisplay';
import Metadata from './components/Metadata';
import queryString from 'query-string';
import styled from 'styled-components';
import { MarcData } from './types';
import DataDownload from './components/DataDownload';
import Header from './components/Header';

const almaSruUrl = 'https://api.sandbox.bibs.aws.unit.no/alma';
const authoritySruUrl = 'https://api.sandbox.bibs.aws.unit.no/authority';
const marc21XmlParserUrl = 'https://api.sandbox.bibs.aws.unit.no/marc21';
const queryParams = queryString.parse(window.location.search);

const RECORD_START_TAG = '<record ';
const RECORD_END_TAG = '</record>';

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

const App: FC = () => {
  const [showXMLPressed, setShowXMLPressed] = useState(true);
  const [marcData, setMarcData] = useState<MarcData | undefined>();
  const [errorPresent, setErrorPresent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    async function getAndParseXMLData() {
      let sruUrl = '';
      let firstAxiosCompleted = false;
      let secondAxiosCompleted = false;
      let resourceXmlResponse = '';
      if (queryParams.auth_id) {
        sruUrl = authoritySruUrl + '?auth_id=' + queryParams.auth_id;
      } else if (queryParams.mms_id) {
        sruUrl = almaSruUrl + '?mms_id=' + queryParams.mms_id;
        if (queryParams.institution) {
          sruUrl += '&institution=' + queryParams.institution;
        }
      }
      if (sruUrl === '') {
        setErrorPresent(true);
        setErrorMessage(`Resource not found. \nSearch parameters have not been included in the URL.`);
        return;
      }
      try {
        resourceXmlResponse = await axios
          .get(sruUrl)
          .then((response) => {
            return response.data;
          })
          .then((data) => {
            const formattedMarc21XML = data.replaceAll('marc:', '').replaceAll('"', "'");
            const recordStartIndex = formattedMarc21XML.indexOf(RECORD_START_TAG);
            const recordEndIndex = formattedMarc21XML.indexOf(RECORD_END_TAG) + RECORD_END_TAG.length;
            const xmlRecord = `<?xml version='1.0' encoding='UTF-8'?>\n${formattedMarc21XML.slice(
              recordStartIndex,
              recordEndIndex
            )}`;
            if (xmlRecord.length > 40) firstAxiosCompleted = true; //
            return xmlRecord;
          });
        await axios
          .post(marc21XmlParserUrl, { xmlRecord: resourceXmlResponse })
          .then((response) => {
            return response.data;
          })
          .then((marcData) => {
            setMarcData(marcData);
            setErrorPresent(false);
            secondAxiosCompleted = true;
          });
      } catch (e) {
        if (!firstAxiosCompleted && !secondAxiosCompleted) {
          setErrorPresent(true);
          setErrorMessage(
            'Resource not found. \nThere exists no resource matching the provided ID, check the URL for possible errors.'
          );
        }
        if (firstAxiosCompleted && !secondAxiosCompleted) {
          setErrorPresent(true);
          setErrorMessage(
            'Failed to prepare the data for presentation, please try again. \nCould not reach server while parsing the retrieved data.'
          );
        }
        if (resourceXmlResponse === '') {
          setErrorPresent(true);
          setErrorMessage('Failed to retrieve the resource, please try again.');
        }
      }
    }
    getAndParseXMLData();
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
      {errorPresent ? <ErrorTextField>{errorMessage}</ErrorTextField> : <Metadata marcData={marcData} />}
      {!errorPresent && marcData && (
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
      )}
      {!errorPresent && marcData && <DataDisplay marcData={marcData} showAsXMLInput={showXMLPressed} />}
      {!errorPresent && marcData && <DataDownload marcData={marcData} />}
    </OuterContainer>
  );
};

export default App;
