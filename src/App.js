import React, {useState, useEffect} from "react";
import "./App.css";
import DataDisplay from "./components/DataDisplay.tsx";
import Button from "@material-ui/core/Button";
import queryString from 'query-string';

const almaSruUrl = 'https://api.sandbox.bibs.aws.unit.no/marc';
const authoritySruUrl = 'https://api.sandbox.bibs.aws.unit.no/authority';
const queryParams = queryString.parse(window.location.search);

function App() {
  const [showXMLPressed, setShowXMLPressed] = useState(true);
  const [text, setText] = useState('')

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

  const showXML = (event) => {
    setShowXMLPressed(true);
  };

  const showLineFormat = () => {
    setShowXMLPressed(false);
  };

  return (
      <>
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
