export interface MarcData {
  mainTitle: string;
  parallelTitle?: string;
  numberOfPartTitle?: string;
  statementOfResponsibility?: string;
  year?: string;
  authors: Author[];
  linePresentation?: string;
  xmlPresentation?: string;
}

export interface Author {
  name: string;
  date?: string;
  id?: string;
}
