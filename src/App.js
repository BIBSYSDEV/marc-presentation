import React, {useState, useEffect} from "react";
import "./App.css";
import DataDisplay from "./components/DataDisplay.tsx";
import Button from "@material-ui/core/Button";
import queryString from 'query-string';
import { getHeaderFieldsFromText } from './parsers'

const almaSruUrl = 'https://api.sandbox.bibs.aws.unit.no/alma';
const authoritySruUrl = 'https://api.sandbox.bibs.aws.unit.no/authority';
const queryParams = queryString.parse(window.location.search);

function App() {
  const [showXMLPressed, setShowXMLPressed] = useState(true);
  const [text, setText] = useState('')
  const [header, setHeader] = useState('')

  let sruUrl;
  if (queryParams.auth_id) {
    sruUrl = authoritySruUrl + "?auth_id=" + queryParams.auth_id;
  } else if (queryParams.mms_id) {
    sruUrl = almaSruUrl + "?mms_id=" + queryParams.mms_id;
    if (queryParams.institution) {
      sruUrl += "&institution=" + queryParams.institution;
    }
  } else {
    alert("params are missing")
  }

  useEffect(()=>{

    fetch(sruUrl, {
      method: 'GET'
    })
    .then(response => {
      return response.text()})
    .then(xml => {
        setText(xml);
    })

  }, [])

    useEffect(() => {
        if(text === "") return

        const headerFields = getHeaderFieldsFromText(text);
        let headerFromFields = headerFields.maintitle;
        if(headerFields.maintitle.endsWith(":")) {
            headerFromFields += " "
        } else {
            headerFromFields += " : "
        }
        headerFromFields += headerFields.paralleltitle
            + ", " + headerFields.numberOfPartTitle
            + " / " + headerFields.statementOfResponsibility
            + " ♠ " + headerFields.author

        setHeader(headerFromFields.trim());
    }, [text])

  const showXML = () => {
    setShowXMLPressed(true);
  };

  const showLineFormat = () => {
    setShowXMLPressed(false);
  };

  return (
      <>
        <h2>{header}</h2>
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
        <DataDisplay
            inputText={text}
            showAsXMLInput={showXMLPressed}
        ></DataDisplay>
      </>
  );
}

export default App;
