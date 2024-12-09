import { dismissAlert, executeTest } from './helpers';
import { CurrentUserTest } from '../constants';

describe('Current User tests', () => {

  beforeAll(async () => {
    await device.launchApp();
  });

  afterEach(async () => {
    await dismissAlert();
  });

  it('can get user info', async () => {
    await executeTest(CurrentUserTest.UserInfo);
  });

  it('can change email', async () => {
    await executeTest(CurrentUserTest.ChangeEmail);
  });

  it('can change phone', async () => {
    await executeTest(CurrentUserTest.ChangePhone);
  });

  it('can list passkeys', async () => {
    await executeTest(CurrentUserTest.ListPasskeys);
  });

  it('can edit passkey', async () => {
    await executeTest(CurrentUserTest.EditPasskey);
  });

  it('can log out', async () => {
    await executeTest(CurrentUserTest.LogOut);
  });

});
