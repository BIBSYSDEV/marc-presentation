import MockAdapter from 'axios-mock-adapter';
import Axios from 'axios';
import { ALMA_API_URL, AUTHORITY_API_URL } from './constants';
import {
  mockAlmaResponse,
  mockAlmaResponseEmpty,
  mockAuthIdThatTriggersServerError,
  mockAuthorityResponse,
  mockMmsIdThatTriggersEmptyResponse,
  mockMmsIdThatTriggersServerError,
} from './mockdata';

export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  // USEFUL FOR DEBUGGING MOCKED_CALLS
  // const mockGetDelayedAndLogged = (pathPattern: string, statusCode: number, mockedResponse: any, delay = 0) => {
  //   mock.onGet(new RegExp(pathPattern)).reply((config) => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve(loggedReply(config, statusCode, mockedResponse));
  //       }, delay);
  //     });
  //   });
  // };
  //
  // const loggedReply = (config: AxiosRequestConfig, statusCode: number, mockedResult: unknown) => {
  //   /* eslint-disable no-console */
  //   //console.log('MOCKED API-CALL: ', config, statusCode, mockedResult);
  //   console.log('MOCKED API-CALL: ', config.url);
  //   return [statusCode, mockedResult];
  // };

  mock.onGet(new RegExp(`${ALMA_API_URL}\\?mms_id=${mockMmsIdThatTriggersServerError}`)).reply(500, null);
  mock
    .onGet(new RegExp(`${ALMA_API_URL}\\?mms_id=${mockMmsIdThatTriggersEmptyResponse}`))
    .reply(200, mockAlmaResponseEmpty);
  mock.onGet(new RegExp(`${ALMA_API_URL}.*`)).reply(200, mockAlmaResponse);
  mock.onGet(new RegExp(`${AUTHORITY_API_URL}\\?auth_id=${mockAuthIdThatTriggersServerError}`)).reply(500, null);
  mock.onGet(new RegExp(`${AUTHORITY_API_URL}.*`)).reply(200, mockAuthorityResponse);

  // ALL OTHER
  mock.onAny().reply(function (config) {
    throw new Error('Could not find mock for ' + config.url + ', with method: ' + config.method);
  });
};
