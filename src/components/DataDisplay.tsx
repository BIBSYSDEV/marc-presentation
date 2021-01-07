import React, {useState, useEffect, FC} from "react";
import styled from "styled-components";
import format from "xml-formatter";
import {isEmpty} from "lodash";

const DataField = styled.textarea`
  height: 20rem;
  width: 30rem;
`;

const DataFieldWrapper = styled.div`
  height: 20rem;
  width: 30rem;
`;

const DataDisplay: FC = (props: any) => {
    const [fileLoaded, setFileLoaded] = useState<Boolean>(false);
    const [showAsXML, setShowAsXML] = useState<Boolean>(false);
    const [xmlPresentation, setXmlPresentation] = useState<string>("");
    const [linePresentation, setLinePresentation] = useState<string>("");

    const transformer = format;

    useEffect(() => {
        if (!isEmpty(props.marcData)) {
            let xmlRec = extractRecord(props.marcData.xmlPresentation);
            setXmlPresentation(transformer(xmlRec));
            setLinePresentation(props.marcData.linePresentation)
            setFileLoaded(true);
        }
        setShowAsXML(props.showAsXMLInput);
    }, [props.marcData, props.showAsXMLInput, transformer]);

    function extractRecord(rawXml: String) {
        let rec = rawXml.replaceAll("marc:", "");
        let recordStartIndex = rec.indexOf("<record ");
        let recordEndIndex = rec.indexOf("</record>");
        rec = rec.slice(recordStartIndex, recordEndIndex);
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + rec;
    }

    const showData = (): string => {
        if (showAsXML) {
            return xmlPresentation;
        } else {
            return linePresentation;
        }
    };

    return (
        <>
            <DataFieldWrapper>
                {fileLoaded === true ? (
                    <DataField value={showData()} readOnly></DataField>
                ) : (
                    <h1>Waiting to display data</h1>
                )}
            </DataFieldWrapper>
        </>
    );
};

export default DataDisplay;
