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
    const [fileLoaded, setFileLoaded] = useState<Boolean>(false);
    const [showAsXML, setShowAsXML] = useState<Boolean>(false);
    const [xmlPresentation, setXmlPresentation] = useState<string>("");
    const [linePresentation, setLinePresentation] = useState<string>("");

    useEffect(() => {
        if (!isEmpty(props.marcData)) {
            setXmlPresentation(props.marcData.xmlPresentation);
            setLinePresentation(props.marcData.linePresentation)
            setFileLoaded(true);
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
