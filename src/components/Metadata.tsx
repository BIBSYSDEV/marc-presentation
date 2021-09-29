import React, { FC } from 'react';
import { Author, MarcData } from '../types';
import styled from 'styled-components';

const TitleLabel = styled.h1`
  color: rgb(0, 0, 0, 1);
  line-height: 3rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  margin-right: 1rem;
`;

const AuthorLabel = styled.span`
  font-size: 1.25rem;
  margin-right: 1rem;
`;

const YearLabel = styled.span`
  font-size: 1.25rem;
  padding-left: 1rem;
  border-left: 1px solid rgba(0, 0, 0, 0.3);
`;

const extractAuthors = (authors: Author[]) => {
  let authorsString = '';
  if (authors && authors.length > 0) {
    authors.forEach((author) => {
      if (authorsString !== '') authorsString += ', ';
      if (author.name !== '') authorsString += author.name;
      if (author.date && author.date !== '') authorsString += ` (${author.date})`;
    });
  }
  return authorsString;
};

const extractTitle = (marcData: MarcData) => {
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
};

interface MetadataProps {
  marcData: MarcData;
}

const Metadata: FC<MetadataProps> = ({ marcData }) => {
  const title = extractTitle(marcData);
  const author = extractAuthors(marcData.authors);
  const year = marcData.year !== '' && marcData.year;

  return (
    <div>
      {title && (
        <TitleLabel data-testid="metadata-title" aria-label="Title">
          {title}
        </TitleLabel>
      )}
      {author && (
        <AuthorLabel data-testid="metadata-author" aria-label="Author">
          {author}
        </AuthorLabel>
      )}
      {year && (
        <YearLabel data-testid="metadata-year" aria-label="Year">
          {year}
        </YearLabel>
      )}
    </div>
  );
};

export default Metadata;
