import format from "xml-formatter/index";

export function getHeaderFieldsFromText(text) {

    const headerFields = {
        maintitle:  "",
        paralleltitle: "",
        statementOfResponsibility: "",
        numberOfPartTitle: "",
        author: "",
    }

    const headerFields130 = JSON.parse(JSON.stringify(headerFields));

    const xmlDoc = getXMLFromText(text)

    let datafields = xmlDoc.getElementsByTagName("datafield");
    for (let i = 0; i < datafields.length; i++) {
        const datafield = datafields.item(i);
        let marccode = datafield.getAttribute("tag")
        if (marccode) {
            marccode = marccode.toString().trim();
            if(marccode === "245") {
                extractTitles(datafield, headerFields)
            } else if (marccode === "246") {
                if(headerFields.maintitle === ""){
                    extractTitles(datafield, headerFields)
                }
            } else if (marccode === "730") {
                if(headerFields.maintitle === ""){
                    extractTitles(datafield, headerFields)
                }
            } else if (marccode === "740") {
                if(headerFields.maintitle === ""){
                    extractTitles(datafield, headerFields)
                }
            } else if (marccode === "130") {
                if(headerFields.maintitle === ""){
                    extractTitles(datafield, headerFields130)
                }
            } else if (marccode === "100") {
                extractAuthor(datafield, headerFields)
            } else if (marccode === "111") {
                extractAuthor(datafield, headerFields)
            }
        }
    }

    if(headerFields.maintitle === "" && headerFields.paralleltitle === "" && headerFields.statementOfResponsibility === "" && headerFields.numberOfPartTitle &&
        (headerFields130.maintitle !== "" || headerFields130.paralleltitle !== "" || headerFields130.statementOfResponsibility !== "" || headerFields130.numberOfPartTitle !== "" )) {
        headerFields.maintitle = headerFields130.maintitle
        headerFields.paralleltitle = headerFields130.paralleltitle
        headerFields.statementOfResponsibility = headerFields130.statementOfResponsibility
        headerFields.numberOfPartTitle = headerFields130.numberOfPartTitle
    }

    return headerFields;
}

function getXMLFromText(text) {
    const transformer = format;
    const xmlData = transformer(text);
    const parser = new DOMParser();
    return parser.parseFromString(xmlData, "text/xml")
}

function extractTitles(datafield, headerFields) {
    const subfields = datafield.getElementsByTagName("subfield")
    for (let i = 0; i < subfields.length; i++) {
        const subfield = subfields.item(i)
        let code = subfield.getAttribute("code")
        if(code && code.toString().trim() === "a") {
            headerFields.maintitle = subfield.textContent.trim()
        } else if (code && code.toString().trim() === "b") {
            headerFields.paralleltitle = subfield.textContent.trim()
        } else if (code && code.toString().trim() === "c") {
            headerFields.statementOfResponsibility = subfield.textContent.trim()
        }
    }
}

function extractAuthor(datafield, headerFields) {
    const subfields = datafield.getElementsByTagName("subfield")
    for (let i = 0; i < subfields.length; i++) {
        const subfield = subfields.item(i)
        let code = subfield.getAttribute("code")
        if(code && code.toString().trim() === "a") {
            headerFields.author = subfield.textContent.trim()
        }
    }
}