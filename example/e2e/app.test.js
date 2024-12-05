import { dismissAlert, executeTest } from './helpers';
import {
  ERROR,
  EXISTING_USER_ID,
  PASSAGE_TEST_APP_ID,
  SUCCESS,
} from '../constants';

describe('App tests', () => {

  beforeAll(async () => {
    await device.launchApp();
  });

  afterEach(async () => {
    await dismissAlert();
  });

  it('passage.app.info returns app info', async () => {
    await executeTest('passage.app.info', PASSAGE_TEST_APP_ID);
  });

  it('passage.app.userExists returns existing user', async () => {
    await executeTest('passage.app.userExists existing_user', EXISTING_USER_ID);
  });

  it('passage.app.userExists returns null if no user', async () => {
    await executeTest('passage.app.userExists no_user', SUCCESS);
  });

  it('passage.app.createUser returns user if did not exist', async () => {
    await executeTest('passage.app.createUser no_user', SUCCESS);
  });

  it('passage.app.createUser throws error if already exists', async () => {
    await executeTest('passage.app.createUser existing_user', ERROR);
  });

});
