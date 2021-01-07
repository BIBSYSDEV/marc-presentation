import React, {useState, useEffect} from "react";
import "./App.css";
import DataDisplay from "./components/DataDisplay.tsx";
import Button from "@material-ui/core/Button";
import queryString from 'query-string';
import {isEmpty} from 'lodash';

const almaSruUrl = 'https://api.sandbox.bibs.aws.unit.no/alma';
const authoritySruUrl = 'https://api.sandbox.bibs.aws.unit.no/authority';
const queryParams = queryString.parse(window.location.search);

function App() {
    const [showXMLPressed, setShowXMLPressed] = useState(true);
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

    useEffect(() => {

        fetch(sruUrl, {
            method: 'GET'
        })
            .then(response => {
                return response.text()
            })
            .then(xml => {
                // TODO Do GET call to new lambda. Mock:
                mockResponseMarc21XmlParser.xmlPresentation = xml;
                setMarcData(mockResponseMarc21XmlParser)
            })

    }, [])

    useEffect(() => {
        if (isEmpty(marcData)) return

        let headerFromFields = marcData.mainTitle;
        if (marcData.mainTitle.endsWith(":")) {
            headerFromFields += " "
        } else {
            headerFromFields += " : "
        }
        headerFromFields += marcData.parallelTitle
        if (marcData.numberOfPartTitle !== "") headerFromFields += ", " + marcData.numberOfPartTitle
        if (marcData.statementOfResponsibility !== "") headerFromFields += " / " + marcData.statementOfResponsibility
        if (marcData.author !== "") headerFromFields += " ♠ " + marcData.author

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
                marcData={marcData}
                showAsXMLInput={showXMLPressed}
            ></DataDisplay>
        </>
    );
}

const mockResponseMarc21XmlParser = {
    mainTitle: "Hobitten :",
    parallelTitle: "Smaugs ødemark i bilder",
    statementOfResponsibility: "Jude Fisher ; oversatt fra engelsk av Camilla Eikeland-Sandnes",
    numberOfPartTitle: "",
    author: "Fisher, Jude",
    xmlPresentation: "",
    linePresentation: "*ldr 01044cam a2200301 c 4500\n" +
        "*001 991325803064702201\n" +
        "*005 20160622160726.0\n" +
        "*007 ta\n" +
        "*008 141124s2013    no#||||j||||||000|0|nob|^\n" +
        "*015 # # $a1337755 $2nbf\n" +
        "*020 # # $a9788210053412 $qib. $cNkr 249.00\n" +
        "*035 # # $a132580306-47bibsys_network\n" +
        "*035 # # $a(NO-TrBIB)132580306\n" +
        "*035 # # $a(NO-OsBA)0370957\n" +
        "*040 # # $aNO-OsNB $bnob $ekatreg\n" +
        "*041 1 # $heng\n" +
        "*042 # # $anorbibl\n" +
        "*044 # # $cno\n" +
        "*082 7 4 $a791.4372 $qNO-OsNB $25/nor\n" +
        "*100 1 # $aFisher, Jude $0(NO-TrBIB)1093967\n" +
        "*245 1 0 $aHobbiten : $bSmaugs ødemark i bilder $cJude Fisher ; oversatt fra engelsk av Camilla Eikeland-Sandnes\n" +
        "*246 1 # $aThe Hobbit $bthe desolation of Smaug visual companion $iOriginaltittel\n" +
        "*260 # # $aOslo $bTiden $c2013\n" +
        "*300 # # $a75 s. $bill. $c28 cm\n" +
        "*700 1 # $aEikeland-Sundnes, Camilla $d1978- $4trl $0(NO-TrBIB)10061339\n" +
        "*856 4 2 $3Beskrivelse fra forlaget (kort) $uhttp://content.bibsys.no/content/?type=descr_publ_brief&isbn=8210053418\n" +
        "*852 0 1 $a47BIBSYS_NB $6991325803064702202 $9D $9P\n" +
        "*901 # # $a90\n" +
        "*913 # # $aNorbok $bNB"
}

export default App;
