import React, { useState, useEffect, FC } from "react";
import { Author, MarcData } from "../types";

interface MetadataProps {
  marcData?: MarcData;
}

const Metadata: FC<MetadataProps> = ({ marcData }) => {
  const [marcDataReady, setMarcDataReady] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (marcData) {
      setTitle(extractTitle(marcData));
      setAuthor(extractAuthors(marcData.authors));
      if (marcData.year && marcData.year !== "") setYear(marcData.year);
      setMarcDataReady(true);
    }
  }, [marcData]);

  return (
    <div>
      {marcDataReady ? (
        <>
          <h1>{title}</h1>
          <h2>{author}</h2>
          <h2>{year}</h2>
        </>
      ) : (
        <h1>Laster data ...</h1>
      )}
    </div>
  );
};

function extractAuthors(authors: Author[]) {
  let authorsString = "";
  if (authors && authors.length > 0) {
    authors.forEach((author) => {
      if (authorsString !== "") authorsString += ", ";
      if (author.name !== "") authorsString += author.name;
      if (author.date && author.date !== "")
        authorsString += `(${author.date})`;
    });
  }
  return authorsString;
}

function extractTitle(marcData: MarcData) {
  const mainTitle = marcData.mainTitle ? marcData.mainTitle.trim() : "";
  const parallelTitle = marcData.parallelTitle
    ? marcData.parallelTitle.trim()
    : "";
  const numberOfPartTitle = marcData.numberOfPartTitle
    ? marcData.numberOfPartTitle.trim()
    : "";
  const statementOfResponsibility = marcData.statementOfResponsibility
    ? marcData.statementOfResponsibility.trim()
    : "";

  let titleFromFields = mainTitle;
  if (parallelTitle !== "") {
    if (mainTitle.endsWith(":")) {
      titleFromFields += " ";
    } else {
      titleFromFields += " : ";
    }
    titleFromFields += parallelTitle;
  }
  if (numberOfPartTitle !== "") titleFromFields += `, ${numberOfPartTitle}`;
  if (statementOfResponsibility !== "")
    titleFromFields += ` / ${statementOfResponsibility}`;

  return titleFromFields.trim();
}

export default Metadata;
