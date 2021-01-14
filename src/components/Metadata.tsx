import React, {useState, useEffect, FC} from "react";
import {isEmpty} from "lodash";

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

const Metadata: FC = (props: any) => {
    const [marcDataReady, setMarcDataReady] = useState<Boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [year, setYear] = useState<string>("");

    useEffect(() => {
        if (!isEmpty(props.marcData)) {
          setTitle(extractTitle(props.marcData))
          setAuthor(extractAuthors(props.marcData.authors))
          if(props.marcData.year && props.marcData.year !== "") setYear(props.marcData.year)
          setMarcDataReady(true)
        }
    }, [props.marcData]);

    return (
        <div>
            {marcDataReady ? (
                <>
                    <h3>{title}</h3>
                    <h4>{author}</h4>
                    <h4>{year}</h4>
                </>
            ) : (
                <h3>Laster data ...</h3>
            )}
        </div>
    );
};

function extractAuthors(authors: Author[]) {
    let authorsString = ""
    if(authors && authors.length > 0) {
        authors.forEach(author => {
            if(authorsString !== "") authorsString += ", "
            if(author.name != "" ) authorsString += author.name
            if(author.date && author.date != "" ) authorsString += " (" + author.date + ")"
        })
    }
    return authorsString
}

function extractTitle(marcData: MarcData) {
    const mainTitle = marcData.mainTitle ? marcData.mainTitle.trim() : ""
    const paralleltitle = marcData.parallelTitle ? marcData.parallelTitle.trim() : ""
    const numberOfPartTitle = marcData.numberOfPartTitle ? marcData.numberOfPartTitle.trim() : ""
    const statementOfResponsibility = marcData.statementOfResponsibility ? marcData.statementOfResponsibility.trim() : ""

    let titleFromFields = mainTitle;
    if (paralleltitle !== "") {
        if (mainTitle.endsWith(":")) {
            titleFromFields += " "
        } else {
            titleFromFields += " : "
        }
        titleFromFields += paralleltitle
    }
    if (numberOfPartTitle !== "") titleFromFields += ", " + numberOfPartTitle
    if (statementOfResponsibility !== "") titleFromFields += " / " + statementOfResponsibility

    return titleFromFields.trim()
}

export default Metadata;
