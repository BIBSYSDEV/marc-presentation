import React, {useState, useEffect, FC} from "react";
import styled from "styled-components";
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
    const [marcDataReady, setMarcDataReady] = useState(false);
    const [showAsXML, setShowAsXML] = useState(false);
    const [xmlPresentation, setXmlPresentation] = useState("");
    const [linePresentation, setLinePresentation] = useState("");

    useEffect(() => {
        if (!isEmpty(props.marcData)) {
            setXmlPresentation(props.marcData.xmlPresentation);
            setLinePresentation(props.marcData.linePresentation)
            setMarcDataReady(true);
        }
        setShowAsXML(props.showAsXMLInput);
    }, [props.marcData, props.showAsXMLInput]);

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
                {marcDataReady ? (
                    <DataField value={showData()} readOnly/>
                ) : (
                    <span>Laster {props.showAsXMLInput ? "xml" : "lineformat"} data ...</span>
                )}
            </DataFieldWrapper>
        </>
    );
};

export default DataDisplay;
