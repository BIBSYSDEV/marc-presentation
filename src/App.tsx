import React, { FC, useEffect, useState } from 'react';
import axios from "axios";
import Button from "@material-ui/core/Button";
import "./App.css";
import DataDisplay from "./components/DataDisplay";
import Metadata from "./components/Metadata";
import queryString from 'query-string';
import {MarcData} from "./types";

const almaSruUrl = 'https://api.sandbox.bibs.aws.unit.no/alma';
const authoritySruUrl = 'https://api.sandbox.bibs.aws.unit.no/authority';
const marc21XmlParserUrl = 'https://api.sandbox.bibs.aws.unit.no/marc21';
const queryParams = queryString.parse(window.location.search);

const App: FC = () => {
    const [showXMLPressed, setShowXMLPressed] = useState(true);
    const [marcData, setMarcData] = useState<MarcData | undefined>()

    let sruUrl = "";
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
                let formattedMarc21XML = data.replaceAll("marc:", "").replaceAll("\"", "'")
                const recordStartIndex = formattedMarc21XML.indexOf("<record ");
                const recordEndIndex = formattedMarc21XML.indexOf("</record>");
                let xmlRecord = "<?xml version='1.0' encoding='UTF-8'?>\n"
                    + formattedMarc21XML.slice(recordStartIndex, recordEndIndex)
                    + "</record>";
                axios.post(marc21XmlParserUrl, { xmlRecord: xmlRecord })
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

export default App;
