import {
  mockAlmaResponse,
  mockAuthIdThatTriggersServerError,
  mockAuthorityResponse,
  mockMmsIdThatTriggersEmptyResponse,
  mockMmsIdThatTriggersServerError,
} from '../../src/mockdata';
import { filename_line_format, filename_XML_format } from '../../src/components/DataDownload';
import path from 'path';

const downloadsFolder = Cypress.config('downloadsFolder');

context('application', () => {
  before('Clear downloads folder', () => {
    cy.exec(`rm ${downloadsFolder}/*`, { log: true, failOnNonZeroExit: false });
  });

  it('successfully shows a full page with data from alma-api', () => {
    cy.visit('?mms_id=543543534');
    cy.get('[data-testid="page-header"]').should('exist');
    cy.get('[data-testid="metadata-title"]').contains(mockAlmaResponse[0].mainTitle);
    cy.get('[data-testid="metadata-author"]').contains(mockAlmaResponse[0].authors[0].name);
    cy.get('[data-testid="metadata-year"]').contains(mockAlmaResponse[0].year);
    cy.get('[data-testid="marc-preview"]').should('exist');
    cy.get('[data-testid="download-xml-format-button"]').should('exist');
    cy.get('[data-testid="download-line-format-button"]').should('exist');
  });

  it('successfully shows a full page with data from authority-api', () => {
    cy.visit('?auth_id=589340589');
    cy.get('[data-testid="page-header"]').should('exist');
    cy.get('[data-testid="metadata-author"]').contains(mockAuthorityResponse[0].authors[0].name);
    cy.get('[data-testid="marc-preview"]').should('exist');
    cy.get('[data-testid="download-xml-format-button"]').should('exist');
    cy.get('[data-testid="download-line-format-button"]').should('exist');
  });

  it('can show different views', () => {
    cy.visit('?mms_id=543543534&institution=xxx');
    cy.get('[data-testid="marc-preview"]').contains(mockAlmaResponse[0].xmlPresentation.substring(0, 20));
    cy.get('[data-testid="radio-button-line-format"]').click();
    cy.get('[data-testid="marc-preview"]').contains(mockAlmaResponse[0].linePresentation.substring(0, 20));
    cy.get('[data-testid="radio-button-xml-format"]').click();
    cy.get('[data-testid="marc-preview"]').contains(mockAlmaResponse[0].xmlPresentation.substring(0, 20));
  });

  it('can download files', () => {
    cy.visit('?mms_id=543543534');
    cy.get('[data-testid="download-xml-format-button"]').click();
    cy.get('[data-testid="download-line-format-button"]').click();
    cy.readFile(path.join(downloadsFolder, filename_XML_format)).should(
      'contain',
      mockAlmaResponse[0].xmlPresentation.substring(0, 20)
    );

    cy.readFile(path.join(downloadsFolder, filename_line_format)).should(
      'contain',
      mockAlmaResponse[0].linePresentation.substring(0, 20)
    );
  });

  it('shows errormessage when alma-api-call fails', () => {
    cy.visit(`?mms_id=${mockMmsIdThatTriggersServerError}`);
    cy.contains('500');
  });
  it('shows errormessage when empty alma-response', () => {
    cy.visit(`?mms_id=${mockMmsIdThatTriggersEmptyResponse}`);
    cy.contains('Check that the input parameter(URL) is correct');
  });

  it('shows errormessage when auth-api-call fails', () => {
    cy.visit(`?mms_id=${mockAuthIdThatTriggersServerError}`);
    cy.contains('500');
  });

  it('shows errormessage when parameter is missing', () => {
    cy.visit(`?mms_id=`);
    cy.contains('Search parameters have not been included in the URL');
    cy.visit(`?random_text`);
    cy.contains('Search parameters have not been included in the URL');
    cy.visit(``);
    cy.contains('Search parameters have not been included in the URL');
  });
});
