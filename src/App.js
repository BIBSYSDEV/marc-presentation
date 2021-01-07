import React, {useState, useEffect} from "react";
import "./App.css";
import DataDisplay from "./components/DataDisplay.tsx";
import Button from "@material-ui/core/Button";
import queryString from 'query-string';
import { isEmpty } from 'lodash';

const almaSruUrl = 'https://api.sandbox.bibs.aws.unit.no/alma';
const authoritySruUrl = 'https://api.sandbox.bibs.aws.unit.no/authority';
const queryParams = queryString.parse(window.location.search);

function App() {
  const [showXMLPressed, setShowXMLPressed] = useState(true);
  const [marcRecordXml, setMarcRecordXml] = useState('')
  const [marcData, setMarcData] = useState({})
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
        setMarcRecordXml(xml);
        // TODO Do GET call to new lambda. Mock:
        setMarcData(mockResponseMarc21XmlParser)
    })

  }, [])

    useEffect(() => {
        if(isEmpty(marcData)) return

        let headerFromFields = marcData.maintitle;
        if(marcData.maintitle.endsWith(":")) {
            headerFromFields += " "
        } else {
            headerFromFields += " : "
        }
        headerFromFields += marcData.paralleltitle
        if(marcData.numberOfPartTitle !== "") headerFromFields += ", " + marcData.numberOfPartTitle
        if(marcData.statementOfResponsibility !== "") headerFromFields+= " / " + marcData.statementOfResponsibility
        if(marcData.author !== "") headerFromFields += " ♠ " + marcData.author

        setHeader(headerFromFields.trim());
    }, [marcData])

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
            inputText={marcRecordXml}
            showAsXMLInput={showXMLPressed}
        ></DataDisplay>
      </>
  );
}

const mockResponseMarc21XmlParser = {
    maintitle:  "Hobitten :",
    paralleltitle: "Smaugs ødemark i bilder",
    statementOfResponsibility: "Jude Fisher ; oversatt fra engelsk av Camilla Eikeland-Sandnes",
    numberOfPartTitle: "",
    author: "Fisher, Jude",
    xml: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<record xmlns=\"http://www.loc.gov/MARC21/slim\">\n" +
        "    <leader>\n" +
        "        01044cam a2200301 c 4500\n" +
        "    </leader>\n" +
        "    <controlfield tag=\"001\">\n" +
        "        991325803064702201\n" +
        "    </controlfield>\n" +
        "    <controlfield tag=\"005\">\n" +
        "        20160622160726.0\n" +
        "    </controlfield>\n" +
        "    <controlfield tag=\"007\">\n" +
        "        ta\n" +
        "    </controlfield>\n" +
        "    <controlfield tag=\"008\">\n" +
        "        141124s2013    no#||||j||||||000|0|nob|^\n" +
        "    </controlfield>\n" +
        "    <datafield tag=\"015\" ind1=\" \" ind2=\" \">\n" +
        "        <subfield code=\"a\">\n" +
        "            1337755\n" +
        "        </subfield>\n" +
        "        <subfield code=\"2\">\n" +
        "            nbf\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"020\" ind1=\" \" ind2=\" \">\n" +
        "        <subfield code=\"a\">\n" +
        "            9788210053412\n" +
        "        </subfield>\n" +
        "        <subfield code=\"q\">\n" +
        "            ib.\n" +
        "        </subfield>\n" +
        "        <subfield code=\"c\">\n" +
        "            Nkr 249.00\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"035\" ind1=\" \" ind2=\" \">\n" +
        "        <subfield code=\"a\">\n" +
        "            132580306-47bibsys_network\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"035\" ind1=\" \" ind2=\" \">\n" +
        "        <subfield code=\"a\">\n" +
        "            (NO-TrBIB)132580306\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"035\" ind1=\" \" ind2=\" \">\n" +
        "        <subfield code=\"a\">\n" +
        "            (NO-OsBA)0370957\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"040\" ind1=\" \" ind2=\" \">\n" +
        "        <subfield code=\"a\">\n" +
        "            NO-OsNB\n" +
        "        </subfield>\n" +
        "        <subfield code=\"b\">\n" +
        "            nob\n" +
        "        </subfield>\n" +
        "        <subfield code=\"e\">\n" +
        "            katreg\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"041\" ind1=\"1\" ind2=\" \">\n" +
        "        <subfield code=\"h\">\n" +
        "            eng\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"042\" ind1=\" \" ind2=\" \">\n" +
        "        <subfield code=\"a\">\n" +
        "            norbibl\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"044\" ind1=\" \" ind2=\" \">\n" +
        "        <subfield code=\"c\">\n" +
        "            no\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"082\" ind1=\"7\" ind2=\"4\">\n" +
        "        <subfield code=\"a\">\n" +
        "            791.4372\n" +
        "        </subfield>\n" +
        "        <subfield code=\"q\">\n" +
        "            NO-OsNB\n" +
        "        </subfield>\n" +
        "        <subfield code=\"2\">\n" +
        "            5/nor\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"100\" ind1=\"1\" ind2=\" \">\n" +
        "        <subfield code=\"a\">\n" +
        "            Fisher, Jude\n" +
        "        </subfield>\n" +
        "        <subfield code=\"0\">\n" +
        "            (NO-TrBIB)1093967\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"245\" ind1=\"1\" ind2=\"0\">\n" +
        "        <subfield code=\"a\">\n" +
        "            Hobbiten :\n" +
        "        </subfield>\n" +
        "        <subfield code=\"b\">\n" +
        "            Smaugs ødemark i bilder\n" +
        "        </subfield>\n" +
        "        <subfield code=\"c\">\n" +
        "            Jude Fisher ; oversatt fra engelsk av Camilla Eikeland-Sandnes\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"246\" ind1=\"1\" ind2=\" \">\n" +
        "        <subfield code=\"a\">\n" +
        "            The Hobbit\n" +
        "        </subfield>\n" +
        "        <subfield code=\"b\">\n" +
        "            the desolation of Smaug visual companion\n" +
        "        </subfield>\n" +
        "        <subfield code=\"i\">\n" +
        "            Originaltittel\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"260\" ind1=\" \" ind2=\" \">\n" +
        "        <subfield code=\"a\">\n" +
        "            Oslo\n" +
        "        </subfield>\n" +
        "        <subfield code=\"b\">\n" +
        "            Tiden\n" +
        "        </subfield>\n" +
        "        <subfield code=\"c\">\n" +
        "            2013\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"300\" ind1=\" \" ind2=\" \">\n" +
        "        <subfield code=\"a\">\n" +
        "            75 s.\n" +
        "        </subfield>\n" +
        "        <subfield code=\"b\">\n" +
        "            ill.\n" +
        "        </subfield>\n" +
        "        <subfield code=\"c\">\n" +
        "            28 cm\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"700\" ind1=\"1\" ind2=\" \">\n" +
        "        <subfield code=\"a\">\n" +
        "            Eikeland-Sundnes, Camilla\n" +
        "        </subfield>\n" +
        "        <subfield code=\"d\">\n" +
        "            1978-\n" +
        "        </subfield>\n" +
        "        <subfield code=\"4\">\n" +
        "            trl\n" +
        "        </subfield>\n" +
        "        <subfield code=\"0\">\n" +
        "            (NO-TrBIB)10061339\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"856\" ind1=\"4\" ind2=\"2\">\n" +
        "        <subfield code=\"3\">\n" +
        "            Beskrivelse fra forlaget (kort)\n" +
        "        </subfield>\n" +
        "        <subfield code=\"u\">\n" +
        "            http://content.bibsys.no/content/?type=descr_publ_brief&amp;isbn=8210053418\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"852\" ind1=\"0\" ind2=\"1\">\n" +
        "        <subfield code=\"a\">\n" +
        "            47BIBSYS_NB\n" +
        "        </subfield>\n" +
        "        <subfield code=\"6\">\n" +
        "            991325803064702202\n" +
        "        </subfield>\n" +
        "        <subfield code=\"9\">\n" +
        "            D\n" +
        "        </subfield>\n" +
        "        <subfield code=\"9\">\n" +
        "            P\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"901\" ind1=\" \" ind2=\" \">\n" +
        "        <subfield code=\"a\">\n" +
        "            90\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "    <datafield tag=\"913\" ind1=\" \" ind2=\" \">\n" +
        "        <subfield code=\"a\">\n" +
        "            Norbok\n" +
        "        </subfield>\n" +
        "        <subfield code=\"b\">\n" +
        "            NB\n" +
        "        </subfield>\n" +
        "    </datafield>\n" +
        "</record>"
}

export default App;
