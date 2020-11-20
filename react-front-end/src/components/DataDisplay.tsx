import React, { FC, useState } from "react";
import styled from "styled-components";

const DataField = styled.textarea`
  height: 20rem;
  width: 20rem;
`;

const DataFieldWrapper = styled.div`
  height: 20rem;
  width: 20rem;
`;

function DataDisplay() {
  const theText =
    '<?xml version="1.0" encoding="UTF-8"?><person ><name>Eirik</leader><gender>male</gender></person>';
  //const translator = require("react-xml-parser");
  //const tempData = new translator().parseFromString(theText);

  const transformer = require("xml-formatter");
  const tempData = transformer(theText);

  const [fileLoaded, setFileLoaded] = useState<Boolean>(false);
  const [theOutput, setOutput] = useState();

  const checkFile = () => {
    if (theText) {
      setOutput(tempData);
      console.log(tempData);
      alert(tempData);
      setFileLoaded(true);
    }
  };

  const showData = (): string => {
    return tempData;
  };

  return (
    <>
      <DataFieldWrapper>
        {fileLoaded ? <DataField value={showData()}></DataField> : <h1>Hei</h1>}
      </DataFieldWrapper>
      <button onClick={checkFile}>Press to read XML</button>
    </>
  );
}

export default DataDisplay;
