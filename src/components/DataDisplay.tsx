import React, {useState, useEffect, FC} from "react";
import styled from "styled-components";
import format from "xml-formatter";

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
      const [xmlData, setXmlData] = useState<string>("");

      const transformer = format;

      useEffect(() => {
        if (props.inputText !== "") {
          let xmlRec = extractRecord(props.inputText);
          setFileLoaded(true);
          setXmlData(transformer(xmlRec));
        }
        setShowAsXML(props.showAsXMLInput);
      }, [props.inputText, props.showAsXMLInput, transformer]);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, "text/xml");
      let rootNode = xmlDoc.getElementsByTagName("record").item(0);


      function extractRecord(rawXml: String) {
        let rec = rawXml.replaceAll("marc:", "");
        let recordStartIndex = rec.indexOf("<record ");
        let recordEndIndex = rec.indexOf("</record>");
        rec = rec.slice(recordStartIndex, recordEndIndex);
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + rec;
      }

      function extractSubfields(parentNode: ChildNode, j: number) {
        let returnString: string = "";
        for (let i = 0; i < parentNode.childNodes[j].childNodes.length; i++) {
          if (parentNode.childNodes[j].childNodes[i]) {
            let theNode = parentNode.childNodes[j].childNodes[i].parentElement;
            if (theNode) {
              if (theNode.getAttribute("code") != null) {
                let subcode = theNode.getAttribute("code")!.toString().trim();
                let value = parentNode.childNodes[j].childNodes[i].textContent!.trim();
                returnString += ` $${subcode}${value}`.trimEnd();
              }
            }
          }
        }
        return returnString;
      }

      function extractMarcDatafields(parentNode: ChildNode) {
        let returnString: string = "";
        for (let j = 1; j < parentNode.childNodes.length; j++) {
          if (parentNode.nodeName !== "controlfield") {
            let theNode = parentNode.childNodes[j].parentElement;
            if (theNode && j === 1) {
              let ind1: string = "";
              let ind2: string = "";
              if (theNode.getAttribute("ind1") != null) {
                if (theNode.getAttribute("ind1")!.toString() === " ") {
                  ind1 = "#";
                } else {
                  ind1 = theNode.getAttribute("ind1")!.toString().trim();
                }
              }
              if (theNode.getAttribute("ind2") != null) {
                if (theNode.getAttribute("ind2")!.toString() === " ") {
                  ind2 = "#";
                } else {
                  ind2 = theNode.getAttribute("ind2")!.toString().trim();
                }
              }
              if (theNode.getAttribute("tag") != null) {
                let marccode = theNode.getAttribute("tag")!.toString().trim();
                returnString += `*${marccode} ${ind1} ${ind2}`;
              }
            }
            returnString += extractSubfields(parentNode, j);
          }
        }
        if (returnString.trim() !== "") {
          return returnString + "\n";
        } else {
          return returnString;
        }
      }

      function extractMarcControlfields(parentNode: ChildNode, i: number) {
        let returnString: string = "";
        if (parentNode.childNodes[i]) {
          let theNode = parentNode.childNodes[i].parentElement;
          if (theNode) {
            let value: string = parentNode.childNodes[i].nodeValue!.trim();
            if (theNode.getAttribute("tag") != null) {
              let marccode: string = theNode.getAttribute("tag")!.toString().trim();
              returnString = `*${marccode} ${value}`.trim();
            } else if (theNode.tagName === "leader") {
              returnString = `*ldr ${value}`.trim();
            }
          }
        }
        return returnString;
      }

      const findChildNodeValue = (parentNode: ChildNode | null): string => {
        if (parentNode === null) {
          return "Missing rootnode";
        }

        for (let i = 0; i < parentNode.childNodes.length; i++) {
          if (parentNode.nodeName !== "datafield") {
            return extractMarcControlfields(parentNode, i) + "\n";
          }
        }

        return extractMarcDatafields(parentNode);
      };

      const showData = (): string => {
        let returnString: string = "";
        if (showAsXML) {
          return xmlData;
        } else {
          if (rootNode) {
            for (let i = 1; i < rootNode.childNodes.length; i++) {
              returnString += findChildNodeValue(rootNode.childNodes[i]);
            }
          }
          return returnString;
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
    }
;

export default DataDisplay;
