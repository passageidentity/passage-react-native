import { dismissAlert, showTestView, executeTest } from './helpers';
import { TokenStoreTest, ViewName } from '../constants';

describe('Token Store tests', () => {

  beforeAll(async () => {
    await device.launchApp();
    await showTestView(ViewName.TokenStoreView);
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
