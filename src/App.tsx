import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import "./App.css";
import DataDisplay from "./components/DataDisplay";
import Metadata from "./components/Metadata";
import queryString from "query-string";
import styled from "styled-components";
import { MarcData } from "./types";

const almaSruUrl = "https://api.sandbox.bibs.aws.unit.no/alma";
const authoritySruUrl = "https://api.sandbox.bibs.aws.unit.no/authority";
const marc21XmlParserUrl = "https://api.sandbox.bibs.aws.unit.no/marc21";
const queryParams = queryString.parse(window.location.search);

const RECORD_START_TAG = "<record ";
const RECORD_END_TAG = "</record>";

const ErrorTextField = styled.div`
  white-space: pre-line;
`;

const App: FC = () => {
  const [showXMLPressed, setShowXMLPressed] = useState(true);
  const [marcData, setMarcData] = useState<MarcData | undefined>();
  const [errorPresent, setErrorPresent] = useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = useState<String>("");

  useEffect(() => {
    async function getAndParseXMLData() {
      let sruUrl = "";
      let firstAxiosCompleted = false;
      let secondAxiosCompleted = false;
      if (queryParams.auth_id) {
        sruUrl = authoritySruUrl + "?auth_id=" + queryParams.auth_id;
      } else if (queryParams.mms_id) {
        sruUrl = almaSruUrl + "?mms_id=" + queryParams.mms_id;
        if (queryParams.institution) {
          sruUrl += "&institution=" + queryParams.institution;
        }
      }
      try {
        const resourceXmlResponse = await axios
          .get(sruUrl)
          .then((response) => {
            return response.data;
          })
          .then((data) => {
            let formattedMarc21XML = data
              .replaceAll("marc:", "")
              .replaceAll('"', "'");
            const recordStartIndex = formattedMarc21XML.indexOf(
              RECORD_START_TAG
            );
            const recordEndIndex =
              formattedMarc21XML.indexOf(RECORD_END_TAG) +
              RECORD_END_TAG.length;
            const xmlRecord = `<?xml version='1.0' encoding='UTF-8'?>\n${formattedMarc21XML.slice(
              recordStartIndex,
              recordEndIndex
            )}`;
            if (xmlRecord.length > 40) firstAxiosCompleted = true;
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

        if (firstAxiosCompleted && !secondAxiosCompleted) {
          setErrorPresent(true);
          setErrorMessage(
            "Failed to prepare the data for presentation, please try again. \nCould not reach server while parsing the retrieved data."
          );
        }

        if (!firstAxiosCompleted && !secondAxiosCompleted) {
          setErrorPresent(true);
          setErrorMessage(
            "Resource not found. \nThere exists no resource matching the provided ID, check the URL for possible errors."
          );
        }
        if (sruUrl === "") {
          setErrorPresent(true);
          setErrorMessage(
            `Resource not found. \nSearch parameters have not been included in the URL.`
          );
        }
      } catch (e) {
        setErrorPresent(true);
        setErrorMessage("Failed to retrieve the resource, please try again.");
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
    <>
      {errorPresent ? (
        <ErrorTextField>
          <b>{errorMessage}</b>
        </ErrorTextField>
      ) : (
        <Metadata marcData={marcData} />
      )}
      <Button
        variant="contained"
        color={showXMLPressed ? "primary" : "default"}
        disableElevation={!showXMLPressed}
        onClick={showXML}
      >
        XML
      </Button>
      {"  "}
      <Button
        variant="contained"
        color={showXMLPressed ? "default" : "primary"}
        disableElevation={showXMLPressed}
        onClick={showLineFormat}
      >
        LineFormat
      </Button>
      {!errorPresent && (
        <DataDisplay marcData={marcData} showAsXMLInput={showXMLPressed} />
      )}
    </>
  );
};

export default App;
