import React, {useState, useEffect, FC} from "react";
import {isEmpty} from "lodash";
import {Button} from "@material-ui/core";

const DataDownload: FC = (props: any) => {
    const [xmlContent, setXmlContent] = useState<string>("");
    const [lineContent, setLineContent] = useState<string>("");

    useEffect(() => {
        if (!isEmpty(props.marcdata)) {
            setXmlContent(props.marcdata.xmlPresentation);
            setLineContent(props.marcdata.linePresentation);
        }
    }, [props.marcData]);

    function createDownload(content: string, filename: string, mimetype: string) {
        let elem = window.document.createElement('a');
        let blob = new Blob([content], {type: mimetype});
        elem.download = filename;
        elem.href = window.URL.createObjectURL(blob);
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }

    const downloadXmlContent = () => {
        createDownload(xmlContent, 'marcpresentation.xml', 'application/xml');
    };

    const downloadLineContent = () => {
        createDownload(lineContent, 'marcpresentation.txt', 'text/plain');
    };

    return (
        <>
            <Button
                variant="outlined"
                color={"default"}
                onClick={downloadXmlContent}
            >
                Download XML
            </Button>
            {"  "}
            <Button
                variant="outlined"
                color={"default"}
                onClick={downloadLineContent}
            >
                Download Lineformat
            </Button>
        </>
    );
};

export default DataDownload;
