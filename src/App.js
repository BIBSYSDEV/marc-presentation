import React, {useState, useEffect} from "react";
import "./App.css";
import DataDisplay from "./components/DataDisplay.tsx";
import Button from "@material-ui/core/Button";

//const almaSruUrl = 'https://bibsys.alma.exlibrisgroup.com/view/sru/47BIBSYS_NETWORK?operation=searchRetrieve&version=1.2&query=alma.mms_id="991325803064702201"';
const almaSruUrl = 'https://6kdv0kt7h3.execute-api.eu-west-1.amazonaws.com/dev/alma?mms_id="991325803064702201"';
const authoritySruUrl = 'https://mhddpy4awa.execute-api.eu-west-1.amazonaws.com/v1/authority/?auth_id=1093967';

function App() {
  const [showXMLPressed, setShowXMLPressed] = useState(true);
  const [text, setText] = useState('')

  useEffect(()=>{

    fetch(authoritySruUrl, {
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
