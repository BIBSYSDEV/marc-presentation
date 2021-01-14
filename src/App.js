import React, {useState, useEffect} from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import "./App.css";
import DataDisplay from "./components/DataDisplay.tsx";
import Metadata from "./components/Metadata";
import queryString from 'query-string';

const almaSruUrl = 'https://api.sandbox.bibs.aws.unit.no/alma';
const authoritySruUrl = 'https://api.sandbox.bibs.aws.unit.no/authority';
const marc21XmlParserUrl = 'https://api.sandbox.bibs.aws.unit.no/marc21';
const queryParams = queryString.parse(window.location.search);

function App() {
    const [showXMLPressed, setShowXMLPressed] = useState(true);
    const [marcData, setMarcData] = useState({})

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
        axios.get(sruUrl)
            .then(response => {
                return response.data
            })
            .then(data => {
                const xmlRecord = extractRecord(data);
                const xmlPresentation = xmlRecord.replaceAll("\"", "'")
                axios.post(marc21XmlParserUrl, { xmlRecord: xmlPresentation })
                    .then(response => {
                        return response.data
                    })
                    .then(marcData => {
                        setMarcData(marcData)
                    })
            })
    }, [sruUrl])

    const showXML = () => {
        setShowXMLPressed(true);
    };

    const showLineFormat = () => {
        setShowXMLPressed(false);
    };

    return (
        <>
            <Metadata marcData={marcData}/>
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
            />
        </>
    );
}

function extractRecord(rawXml) {
    let rec = rawXml.replaceAll("marc:", "");
    const recordStartIndex = rec.indexOf("<record ");
    const recordEndIndex = rec.indexOf("</record>");
    rec = rec.slice(recordStartIndex, recordEndIndex);
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + rec + "</record>";
}

export default App;
