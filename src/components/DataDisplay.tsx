import React, { useState, useEffect, FC } from "react";
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
      setFileLoaded(true);
      setXmlData(transformer(props.inputText));
    }
    setShowAsXML(props.showAsXMLInput);
  }, [props.inputText, props.showAsXMLInput, transformer]);

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlData, "text/xml");
  let rootNode = xmlDoc.getElementsByTagName("record").item(0);

  const findChildNodeValue = (parentNode: ChildNode | null): string => {
    if (parentNode === null) {
      return "Missing rootnode";
    }
    let returnString: string = "";
    let tempString: string = "";

    for (let i = 0; i < parentNode.childNodes.length; i++) {
      if (parentNode.childNodes[i]) {
        let theNode = parentNode.childNodes[i].parentElement;
        if (theNode) {
          let ind1 = "#";
          if (theNode.getAttribute("ind1") != null) {
              if (theNode.getAttribute("ind1") != " ") {
                ind1 = theNode.getAttribute("ind1");
              }
          }
          let ind2 = "#";
          if (theNode.getAttribute("ind2") != null) {
              if (theNode.getAttribute("ind2") != " ") {
                ind2 = theNode.getAttribute("ind2");
              }
          }
          if (theNode.getAttribute("tag") != null) {
            tempString +=
              "*" +
              theNode
                .getAttribute("tag")!
                .toString()
                .trim() +
              ind1 +
              ind2;
          }
        }
        returnString += tempString;
        tempString = "";
        tempString += parentNode.childNodes[i].nodeValue;
        returnString += tempString.trim() + " ";
        tempString = "";
      }
      if (parentNode.nodeName !== "datafield") {
        return returnString;
      }
    }

    returnString = "";

    for (let j = 1; j < parentNode.childNodes.length; j++) {
      let theNode = parentNode.childNodes[j].parentElement;
      if (theNode && j === 1) {
        if (theNode.getAttribute("tag") != null) {
          tempString +=
            "*" +
            theNode
              .getAttribute("tag")!
              .toString()
              .trim() +
            " ";
        }
      }
      for (let i = 0; i < parentNode.childNodes[j].childNodes.length; i++) {
        if (parentNode.childNodes[j].childNodes[i]) {
          let theNode = parentNode.childNodes[j].childNodes[i].parentElement;
          if (theNode) {
            if (theNode.getAttribute("code") != null) {
              tempString +=
                "$" +
                theNode
                  .getAttribute("code")!
                  .toString()
                  .trim();
            }
          }
          returnString += tempString;
          tempString = "";
          tempString += parentNode.childNodes[j].childNodes[i].textContent;
          returnString += tempString.trim() + " ";
          tempString = "";
        }
      }
    }

    returnString += "\n";
    return returnString;
  };

  const showData = (): string => {
    let returnString: string = "";
    if (showAsXML === true) {
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
};

export default DataDisplay;
