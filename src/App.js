import React, { useState } from "react";
import "./App.css";
import DataDisplay from "./components/DataDisplay.tsx";
import Button from "@material-ui/core/Button";

function App() {
  const [showXMLPressed, setShowXMLPressed] = useState(true);
  const theText =
    '<?xml version="1.0" encoding="UTF-8"?> \
  <record xmlns="http://www.loc.gov/MARC21/slim"> \
    <leader>02122nas-a2200541-a-4500</leader> \
    <controlfield tag="001">999919897183302201</controlfield> \
    <controlfield tag="005">20200910145055.0</controlfield> \
    <controlfield tag="006">m-----o--d--------</controlfield> \
    <controlfield tag="007">cr-|||||||||||</controlfield> \
    <controlfield tag="008">001213c19989999mauqr-p-o-----0---a0eng-c</controlfield> \
    <datafield ind1=" " ind2=" " tag="010"> \
      <subfield code="a">00213343</subfield> \
    </datafield> \
    <datafield ind1="7" ind2=" " tag="016"> \
      <subfield code="a">2070928-6</subfield> \
      <subfield code="2">DE-600</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="022"> \
      <subfield code="a">1532-8937</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="035"> \
      <subfield code="a">(OCoLC)45555110</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="035"> \
      <subfield code="a">(CKB)110985821000953</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="035"> \
      <subfield code="a">(CONSER)---00213343-</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="035"> \
      <subfield code="a">(DE-599)ZDB2070928-6</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="035"> \
      <subfield code="a">(EXLCZ)99110985821000953</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="037"> \
      <subfield code="b">Sloan Management Review Assoc., MIT Sloan School of Management, 77 Mass. Ave., E60-100, Cambridge, MA 02139-4307</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="042"> \
      <subfield code="a">nsdp</subfield> \
      <subfield code="a">pcc</subfield> \
    </datafield> \
    <datafield ind1=" " ind2="4" tag="050"> \
      <subfield code="a">HD28</subfield> \
      <subfield code="b">.I14</subfield> \
    </datafield> \
    <datafield ind1=" " ind2="4" tag="060"> \
      <subfield code="a">W1</subfield> \
      <subfield code="b">SL585</subfield> \
    </datafield> \
    <datafield ind1="0" ind2=" " tag="130"> \
      <subfield code="a">MIT Sloan management review (Online)</subfield> \
    </datafield> \
    <datafield ind1=" " ind2="0" tag="222"> \
      <subfield code="a">MIT Sloan management review</subfield> \
      <subfield code="b">(Online)</subfield> \
    </datafield> \
    <datafield ind1="1" ind2="0" tag="245"> \
      <subfield code="a">MIT Sloan management review.</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="260"> \
      <subfield code="a">Cambridge, Mass. :</subfield> \
      <subfield code="b">Sloan Management Review Association :</subfield> \
      <subfield code="b">MIT Sloan School of Management,</subfield> \
      <subfield code="c">©1998-</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="310"> \
      <subfield code="a">Quarterly</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="336"> \
      <subfield code="a">text</subfield> \
      <subfield code="b">txt</subfield> \
      <subfield code="2">rdacontent</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="337"> \
      <subfield code="a">computer</subfield> \
      <subfield code="b">c</subfield> \
      <subfield code="2">rdamedia</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="338"> \
      <subfield code="a">online resource</subfield> \
      <subfield code="b">cr</subfield> \
      <subfield code="2">rdacarrier</subfield> \
    </datafield> \
    <datafield ind1="1" ind2=" " tag="362"> \
      <subfield code="a">Print began with vol. 39, no. 2 (winter 1998).</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="538"> \
      <subfield code="a">Mode of access: World Wide Web.</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="588"> \
      <subfield code="a">Description based on: Vol. 42, no. 2 (winter 2001); title from contents screen (viewed Feb. 22, 2001).</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="588"> \
      <subfield code="a">Latest issue consulted: Vol. 53, issue 4 (summer 2012) (publishers Web site, viewed Sept. 6, 2012).</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="500"> \
      <subfield code="a">Refereed/Peer-reviewed</subfield> \
    </datafield> \
    <datafield ind1=" " ind2="0" tag="650"> \
      <subfield code="a">Industrial management</subfield> \
      <subfield code="v">Periodicals.</subfield> \
    </datafield> \
    <datafield ind1=" " ind2="6" tag="650"> \
      <subfield code="a">Gestion dentreprise</subfield> \
      <subfield code="v">Périodiques.</subfield> \
    </datafield> \
    <datafield ind1="0" ind2="1" tag="852"> \
      <subfield code="a">47BIBSYS_UBTO</subfield> \
      <subfield code="6">999919787334802205</subfield> \
      <subfield code="9">E</subfield> \
    </datafield> \
    <datafield ind1="0" ind2="1" tag="852"> \
      <subfield code="a">47BIBSYS_DEPSS</subfield> \
      <subfield code="6">999919666309502253</subfield> \
      <subfield code="9">E</subfield> \
    </datafield> \
    <datafield ind1="0" ind2="1" tag="852"> \
      <subfield code="a">47BIBSYS_FHS</subfield> \
      <subfield code="6">999919792203402275</subfield> \
      <subfield code="9">E</subfield> \
    </datafield> \
    <datafield ind1=" " ind2=" " tag="906"> \
      <subfield code="a">JOURNAL</subfield> \
    </datafield> \
  </record>';

  const showXML = (event) => {
    setShowXMLPressed(true);
  };

  const showLineFormat = () => {
    setShowXMLPressed(false);
  };

  return (
    <>
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
        inputText={theText}
        showAsXMLInput={showXMLPressed}
      ></DataDisplay>
    </>
  );
}

export default App;
