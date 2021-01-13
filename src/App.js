import React, {useState, useEffect} from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import "./App.css";
import DataDisplay from "./components/DataDisplay.tsx";
import format from "xml-formatter";
import queryString from 'query-string';
import {isEmpty} from 'lodash';

const almaSruUrl = 'https://api.sandbox.bibs.aws.unit.no/alma';
const authoritySruUrl = 'https://api.sandbox.bibs.aws.unit.no/authority';
const marc21XmlParserUrl = 'https://api.sandbox.bibs.aws.unit.no/marc21';
const queryParams = queryString.parse(window.location.search);

function App() {
    const [showXMLPressed, setShowXMLPressed] = useState(true);
    const [marcData, setMarcData] = useState({})
    const [header, setHeader] = useState('')

    const transformer = format;

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
                const xmlPresentation = transformer(xmlRecord)
                    .replaceAll("\"", "\'")
                    .replaceAll("\n", "");

                axios.post(marc21XmlParserUrl, { xmlRecord: xmlPresentation })
                    .then(response => {
                        return response.data
                    })
                    .then(marcData => {
                        setMarcData(marcData)
                    })
            })
    }, [sruUrl, transformer])

    useEffect(() => {
        if (isEmpty(marcData)) {
            setHeader("Laster data... ")
            return
        } else {
            setHeader(extractHeaderFromMarcDataFields(marcData))
        }
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
            />
        </>
    );
}

function extractRecord(rawXml) {
    let rec = rawXml.replaceAll("marc:", "");
    const recordStartIndex = rec.indexOf("<record ");
    const recordEndIndex = rec.indexOf("</record>");
    rec = rec.slice(recordStartIndex, recordEndIndex);
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + rec;
}

function extractHeaderFromMarcDataFields(marcData) {
    const mainTitle = marcData.mainTitle ? marcData.mainTitle.trim() : ""
    const paralleltitle = marcData.paralleltitle ? marcData.paralleltitle.trim() : ""
    const numberOfPartTitle = marcData.numberOfPartTitle ? marcData.numberOfPartTitle.trim() : ""
    const statementOfResponsibility = marcData.statementOfResponsibility ? marcData.statementOfResponsibility.trim() : ""
    const year = marcData.year ? marcData.year.trim() : ""
    let authors = ""
    if(marcData.authors && marcData.authors.length > 0) {
        marcData.authors.forEach(author => {
            if(authors !== "") authors += ", "
            authors += author
        })
    }
    let headerFromFields = mainTitle;
    if (paralleltitle !== "") {
        if (mainTitle.endsWith(":")) {
            headerFromFields += " "
        } else {
            headerFromFields += " : "
        }
        headerFromFields += paralleltitle
    }
    if (numberOfPartTitle !== "") headerFromFields += ", " + numberOfPartTitle
    if (statementOfResponsibility !== "") headerFromFields += " / " + statementOfResponsibility
    if (authors !== "") headerFromFields += " ♠ " + authors
    if (year !== "") headerFromFields += " (" + year + ")"
    return headerFromFields.trim()
}

export default App;
