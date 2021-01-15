import React, {useState, useEffect, FC} from "react";
import styled from "styled-components";
import {MarcData} from "../types";

const DataField = styled.textarea`
  height: 20rem;
  width: 30rem;
`;

const DataFieldWrapper = styled.div`
  height: 20rem;
  width: 30rem;
`;

interface DataDisplayProps {
    marcData?: MarcData
    showAsXMLInput: boolean
}

const DataDisplay: FC<DataDisplayProps> = ({ marcData , showAsXMLInput}) => {
    const [marcDataReady, setMarcDataReady] = useState(false);
    const [showAsXML, setShowAsXML] = useState(false);
    const [xmlPresentation, setXmlPresentation] = useState("");
    const [linePresentation, setLinePresentation] = useState("");

    useEffect(() => {
        if (marcData) {
            setXmlPresentation(marcData.xmlPresentation ? marcData.xmlPresentation : "");
            setLinePresentation(marcData.linePresentation ? marcData.linePresentation : "")
            setMarcDataReady(true);
        }
        setShowAsXML(showAsXMLInput);
    }, [marcData, showAsXMLInput]);

    const showData = (): string => {
        if (showAsXML) {
            return xmlPresentation;
        } else {
            return linePresentation;
        }
    };

    return (
        <DataFieldWrapper>
            {marcDataReady ? (
                <DataField value={showData()} readOnly/>
            ) : (
                <span>Laster {showAsXMLInput ? "xml" : "lineformat"} data ...</span>
            )}
        </DataFieldWrapper>
    );
};

export default DataDisplay;
