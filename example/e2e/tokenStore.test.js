import { dismissAlert, executeTest } from './helpers';
import { TokenStoreTest } from '../constants';

describe('Token Store tests', () => {

  beforeAll(async () => {
    await device.launchApp();
  });

  afterEach(async () => {
    await dismissAlert();
  });

  it('can get auth token if signed in', async () => {
    await executeTest(TokenStoreTest.TokenIsValid);
  });

  it('can not get auth token if signed out', async () => {
    await executeTest(TokenStoreTest.TokenIsInvalid);
  });

});
