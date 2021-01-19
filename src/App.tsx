import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import "./App.css";
import DataDisplay from "./components/DataDisplay";
import Metadata from "./components/Metadata";
import queryString from "query-string";
import { MarcData } from "./types";

const almaSruUrl = "https://api.sandbox.bibs.aws.unit.no/alma";
const authoritySruUrl = "https://api.sandbox.bibs.aws.unit.no/authority";
const marc21XmlParserUrl = "https://api.sandbox.bibs.aws.unit.no/marc21";
const queryParams = queryString.parse(window.location.search);

const RECORD_START_TAG = "<record ";
const RECORD_END_TAG = "</record>";

const App: FC = () => {
  const [showXMLPressed, setShowXMLPressed] = useState(true);
  const [marcData, setMarcData] = useState<MarcData | undefined>();
  const [errorPresent, setErrorPresent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  let sruUrl = "";
  if (queryParams.auth_id) {
    sruUrl = authoritySruUrl + "?auth_id=" + queryParams.auth_id;
  } else if (queryParams.mms_id) {
    sruUrl = almaSruUrl + "?mms_id=" + queryParams.mms_id;
    if (queryParams.institution) {
      sruUrl += "&institution=" + queryParams.institution;
    }
  }

  useEffect(() => {
    async function getAndParseXMLData() {
      try {
        let firstAxiosCompleted = false;
        let secondAxiosCompleted = false;
        await axios
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
            axios
              .post(marc21XmlParserUrl, { xmlRecord: xmlRecord })
              .then((response) => {
                return response.data;
              })
              .then((marcData) => {
                setMarcData(marcData);
                setErrorPresent(false);
                secondAxiosCompleted = true;
              });
          });
        if (firstAxiosCompleted && !secondAxiosCompleted) {
          setErrorPresent(true);
          setErrorMessage(
            "Could not reach server while parsing the retrieved data, please try again"
          );
        }

        if (!firstAxiosCompleted && !secondAxiosCompleted) {
          setErrorPresent(true);
          setErrorMessage(
            "Resource not found. There exists no resource matching the provided ID, check the URL for possible errors"
          );
        }
        if (sruUrl === "") {
          setErrorPresent(true);
          setErrorMessage(
            "Missing search params in the URL. Make sure that the complete URL with search paramaters is provided."
          );
        }
      } catch (e) {
        setErrorPresent(true);
        setErrorMessage(
          "Could not reach server while retrieving resource, please try again"
        );
      }
    }
    getAndParseXMLData();
  }, [sruUrl]);

  const showXML = () => {
    setShowXMLPressed(true);
  };

  const showLineFormat = () => {
    setShowXMLPressed(false);
  };

  return (
    <>
      {errorPresent ? (
        <h2> {errorMessage} </h2>
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
