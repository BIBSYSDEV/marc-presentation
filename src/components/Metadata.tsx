import React, { useState, useEffect, FC } from 'react';
import { Author, MarcData } from '../types';
import styled from 'styled-components';

interface MetadataProps {
  marcData?: MarcData;
}

const TitleLabel = styled.h1`
  color: rgb(0, 0, 0, 1);
  font-size: 1.5rem;
  font-family: Barlow, sans-serif;
  font-weight: Bold;
  line-height: 3rem;
  letter-spacing: 0.0025em;
  margin-left: 1rem;
  margin-right: 1rem;
  border-bottom: 1px solid grey;
`;

const AuthorLabel = styled.h2`
  font-size: 1.25rem;
  font-family: Barlow, sans-serif;
  font-weight: 500;
  line-height: 1.6;
  margin-left: 1rem;
  margin-top: 0;
  margin-bottom: 0;
  display: inline;
`;

const YearLabel = styled.h2`
  font-size: 1.25rem;
  font-family: Barlow, sans-serif;
  font-weight: 500;
  line-height: 1.6;
  margin-left: 1rem;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 1rem;
  border-left: 1px solid rgba(0, 0, 0, 0.3);
  display: inline;
`;

const Metadata: FC<MetadataProps> = ({ marcData }) => {
  const [marcDataReady, setMarcDataReady] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    if (marcData) {
      setTitle(extractTitle(marcData));
      setAuthor(extractAuthors(marcData.authors));
      if (marcData.year && marcData.year !== '') setYear(marcData.year);
      setMarcDataReady(true);
    }
  }, [marcData]);

  return (
    <div>
      {marcDataReady ? (
        <>
          {title && <TitleLabel aria-label="Title">{title}</TitleLabel>}
          {author && <AuthorLabel aria-label="Author">{author}</AuthorLabel>}
          {year && <YearLabel aria-label="Year">{year}</YearLabel>}
        </>
      ) : (
        <h1>Laster data ...</h1>
      )}
    </div>
  );
};

function extractAuthors(authors: Author[]) {
  let authorsString = '';
  if (authors && authors.length > 0) {
    authors.forEach((author) => {
      if (authorsString !== '') authorsString += ', ';
      if (author.name !== '') authorsString += author.name;
      if (author.date && author.date !== '') authorsString += `(${author.date})`;
    });
  }
  return authorsString;
}

function extractTitle(marcData: MarcData) {
  const mainTitle = marcData.mainTitle ? marcData.mainTitle.trim() : '';
  const parallelTitle = marcData.parallelTitle ? marcData.parallelTitle.trim() : '';
  const numberOfPartTitle = marcData.numberOfPartTitle ? marcData.numberOfPartTitle.trim() : '';
  const statementOfResponsibility = marcData.statementOfResponsibility ? marcData.statementOfResponsibility.trim() : '';

  let titleFromFields = mainTitle;
  if (parallelTitle !== '') {
    if (mainTitle.endsWith(':')) {
      titleFromFields += ' ';
    } else {
      titleFromFields += ' : ';
    }
    titleFromFields += parallelTitle;
  }
  if (numberOfPartTitle !== '') titleFromFields += `, ${numberOfPartTitle}`;
  if (statementOfResponsibility !== '') titleFromFields += ` / ${statementOfResponsibility}`;

  return titleFromFields.trim();
}

export default Metadata;
