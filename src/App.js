import React, {useState, useEffect} from "react";
import "./App.css";
import DataDisplay from "./components/DataDisplay.tsx";
import Button from "@material-ui/core/Button";

//const almaSruUrl = 'https://bibsys.alma.exlibrisgroup.com/view/sru/47BIBSYS_NETWORK?operation=searchRetrieve&version=1.2&query=alma.mms_id="991325803064702201"';
const almaSruUrl = 'https://6kdv0kt7h3.execute-api.eu-west-1.amazonaws.com/dev/alma?mms_id="991325803064702201"';
const authoritySruUrl = 'https://authority.bibsys.no/authority/rest/sru?operation=searchRetrieve&version=1.2&query=rec.identifier="1093967"';

function App() {
  const [showXMLPressed, setShowXMLPressed] = useState(true);
  const [text, setText] = useState('')

  useEffect(()=>{

    fetch(almaSruUrl, {
      method: 'GET',
      mode: 'no-cors'
    })
    .then(response => {
      console.log(response);
      return response.data})
    .then(xml => {
      setText(xml);
      console.log("xml", xml)
    })

  }, [])


console.log("text: " ,text);

  const theText =
      '<?xml version="1.0" encoding="UTF-8"?>\
  <record xmlns="http://www.loc.gov/MARC21/slim">\
            <leader>01044cam a2200301 c 4500</leader>\
            <controlfield tag="001">991325803064702201</controlfield>\
            <controlfield tag="005">20160622160726.0</controlfield>\
            <controlfield tag="007">ta</controlfield>\
            <controlfield tag="008">141124s2013    no#||||j||||||000|0|nob|^</controlfield>\
            <datafield ind1=" " ind2=" " tag="015">\
              <subfield code="a">1337755</subfield>\
              <subfield code="2">nbf</subfield>\
            </datafield>\
            <datafield ind1=" " ind2=" " tag="020">\
              <subfield code="a">9788210053412</subfield>\
              <subfield code="q">ib.</subfield>\
              <subfield code="c">Nkr 249.00</subfield>\
            </datafield>\
            <datafield ind1=" " ind2=" " tag="035">\
              <subfield code="a">132580306-47bibsys_network</subfield>\
            </datafield>\
            <datafield ind1=" " ind2=" " tag="035">\
              <subfield code="a">(NO-TrBIB)132580306</subfield>\
            </datafield>\
            <datafield ind1=" " ind2=" " tag="035">\
              <subfield code="a">(NO-OsBA)0370957</subfield>\
            </datafield>\
            <datafield ind1=" " ind2=" " tag="040">\
              <subfield code="a">NO-OsNB</subfield>\
              <subfield code="b">nob</subfield>\
              <subfield code="e">katreg</subfield>\
            </datafield>\
            <datafield ind1="1" ind2=" " tag="041">\
              <subfield code="h">eng</subfield>\
            </datafield>\
            <datafield ind1=" " ind2=" " tag="042">\
              <subfield code="a">norbibl</subfield>\
            </datafield>\
            <datafield ind1=" " ind2=" " tag="044">\
              <subfield code="c">no</subfield>\
            </datafield>\
            <datafield ind1="7" ind2="4" tag="082">\
              <subfield code="a">791.4372</subfield>\
              <subfield code="q">NO-OsNB</subfield>\
              <subfield code="2">5/nor</subfield>\
            </datafield>\
            <datafield ind1="1" ind2=" " tag="100">\
              <subfield code="a">Fisher, Jude</subfield>\
              <subfield code="0">(NO-TrBIB)1093967</subfield>\
            </datafield>\
            <datafield ind1="1" ind2="0" tag="245">\
              <subfield code="a">Hobbiten :</subfield>\
              <subfield code="b">Smaugs ødemark i bilder</subfield>\
              <subfield code="c">Jude Fisher ; oversatt fra engelsk av Camilla Eikeland-Sandnes</subfield>\
            </datafield>\
            <datafield ind1="1" ind2=" " tag="246">\
              <subfield code="a">The Hobbit</subfield>\
              <subfield code="b">the desolation of Smaug visual companion</subfield>\
              <subfield code="i">Originaltittel</subfield>\
            </datafield>\
            <datafield ind1=" " ind2=" " tag="260">\
              <subfield code="a">Oslo</subfield>\
              <subfield code="b">Tiden</subfield>\
              <subfield code="c">2013</subfield>\
            </datafield>\
            <datafield ind1=" " ind2=" " tag="300">\
              <subfield code="a">75 s.</subfield>\
              <subfield code="b">ill.</subfield>\
              <subfield code="c">28 cm</subfield>\
            </datafield>\
            <datafield ind1="1" ind2=" " tag="700">\
              <subfield code="a">Eikeland-Sundnes, Camilla</subfield>\
              <subfield code="d">1978-</subfield>\
              <subfield code="4">trl</subfield>\
              <subfield code="0">(NO-TrBIB)10061339</subfield>\
            </datafield>\
            <datafield ind1="4" ind2="2" tag="856">\
              <subfield code="3">Beskrivelse fra forlaget (kort)</subfield>\
              <subfield code="u">http://content.bibsys.no/content/?type=descr_publ_brief&amp;isbn=8210053418</subfield>\
            </datafield>\
            <datafield ind1="0" ind2="1" tag="852">\
              <subfield code="a">47BIBSYS_NB</subfield>\
              <subfield code="6">991325803064702202</subfield>\
              <subfield code="9">D</subfield>\
              <subfield code="9">P</subfield>\
            </datafield>\
            <datafield ind1=" " ind2=" " tag="901">\
              <subfield code="a">90</subfield>\
            </datafield>\
            <datafield ind1=" " ind2=" " tag="913">\
              <subfield code="a">Norbok</subfield>\
              <subfield code="b">NB</subfield>\
            </datafield>\
          </record>';

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
            inputText={theText}
            showAsXMLInput={showXMLPressed}
        ></DataDisplay>
      </>
  );
}

export default App;
